import type {
  Actions,
  Config,
  Event,
  Events,
  FailureStage,
  Force,
  Intent,
  Listener,
  Options,
  Resolution,
  Service,
  State,
  View,
} from "./types";
import type { Emitter } from "@zoobzio/kit";

import { makeEmitter, makeProxy } from "@zoobzio/kit";
import { VIEWS_STATE_FIELDS } from "./constants";
import { envelope, same } from "./util";

/**
 * The headless views machine. Owns the list of saved views, which one is
 * active, and the lifecycle around them: select, save, save as, rename,
 * remove, revert, and the confirmation of whichever of those would lose
 * something. It does not own the live payload: `wiring.read` yields it and
 * `wiring.apply` puts one in place, so whatever the views are over stays
 * the source of truth and `drifted` is the difference between the two.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container can be a plain object or a reactive proxy; the
 * service replaces each member as a whole. Each write emits `change`, and
 * the lifecycle methods emit their own events. `on` subscribes.
 */
export class ViewsService<P> implements Service<P> {
  /**
   * The config, shallow-frozen, so a reactive proxy never wraps the
   * schema however the consumer holds the service.
   */
  public readonly config: Config<P>;
  private readonly state: State<P>;
  private readonly emitter: Emitter<Events<P>> = makeEmitter();

  constructor(
    public readonly id: string,
    config: Config<P>,
    state: State<P>,
    private readonly wiring: Actions<P>,
    options: Options<P> = {},
  ) {
    this.config = Object.freeze({ ...config });
    this.state = makeProxy(state, VIEWS_STATE_FIELDS, options, this.emitter);
  }

  on<E extends Event<P>>(event: E, listener: Listener<P, E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- state -----------------------------------------------------------

  get views(): View<P>[] {
    return this.state.views;
  }
  get stale(): View<unknown>[] {
    return this.state.stale;
  }
  get active(): string | null {
    return this.state.active;
  }
  get pending(): Intent | null {
    return this.state.pending;
  }
  get loading(): boolean {
    return this.state.loading;
  }
  get saving(): boolean {
    return this.state.saving;
  }
  get initialized(): boolean {
    return this.state.initialized;
  }

  // --- derived ---------------------------------------------------------

  get current(): View<P> | undefined {
    return this.find(this.active);
  }

  get payload(): P {
    return this.config.schema.parse(this.wiring.read());
  }

  get drifted(): boolean {
    const current = this.current;
    if (!this.initialized || !current) return false;
    const live = this.config.schema.safeParse(this.wiring.read());
    if (!live.success) return true;
    return !this.equal(live.data, current.payload);
  }

  get editable(): boolean {
    return this.current?.origin === "user";
  }

  private find(id: string | null): View<P> | undefined {
    return this.views.find((view) => view.id === id);
  }

  private equal(a: P, b: P): boolean {
    return (this.config.equals ?? same)(a, b);
  }

  // --- lifecycle -------------------------------------------------------

  async init(): Promise<boolean> {
    if (this.initialized) return true;

    this.state.loading = true;
    try {
      const stored = (await this.wiring.load?.(this)) ?? [];
      this.merge(stored);
      const active = this.find(this.active) ?? this.views[0];
      this.state.active = active?.id ?? null;
      if (active) await this.wiring.apply(this.copy(active.payload));
    } catch (cause) {
      this.fail("init", cause);
    } finally {
      this.state.loading = false;
    }

    this.state.initialized = true;
    this.emitter.emit("initialized", { id: this.id, views: this.views });
    return true;
  }

  /**
   * Lays the stored records over the views held: a record under an id
   * already held replaces it, the others follow in the order given.
   */
  private merge(stored: unknown[]): void {
    const views = [...this.views];
    const stale: View<unknown>[] = [];
    for (const record of stored) {
      const read = envelope(record);
      if (!read) continue;
      const parsed = this.config.schema.safeParse(read.payload);
      if (!parsed.success) {
        stale.push(read);
        continue;
      }
      const view: View<P> = { ...read, payload: parsed.data };
      const index = views.findIndex((held) => held.id === view.id);
      if (index < 0) views.push(view);
      else views[index] = view;
    }
    this.state.views = views;
    this.state.stale = stale;
  }

  /**
   * A payload of its own for whoever is handed one: what the container
   * holds is never the object the target keeps.
   */
  private copy(payload: P): P {
    return this.config.schema.parse(payload);
  }

  private fail(stage: FailureStage, cause: unknown): never {
    this.emitter.emit("failed", { id: this.id, stage, cause });
    throw cause;
  }

  // --- selection -------------------------------------------------------

  async select(id: string, { force = false }: Force = {}): Promise<boolean> {
    if (id === this.active || !this.find(id)) return false;
    if (!force && this.drifted) {
      this.state.pending = { kind: "select", id };
      return false;
    }
    await this.go(id);
    return true;
  }

  private async go(id: string): Promise<void> {
    const view = this.find(id);
    if (!view) return;
    await this.put(view);
    const from = this.active;
    this.state.active = view.id;
    this.emitter.emit("selected", { id: this.id, view, from });
  }

  private async put(view: View<P>): Promise<void> {
    try {
      await this.wiring.apply(this.copy(view.payload));
    } catch (cause) {
      this.fail("apply", cause);
    }
  }

  async revert({ force = false }: Force = {}): Promise<void> {
    const current = this.current;
    if (!current || !this.drifted) return;
    if (!force) {
      this.state.pending = { kind: "revert" };
      return;
    }
    await this.put(current);
    this.emitter.emit("reverted", { id: this.id, view: current });
  }

  // --- storage ---------------------------------------------------------

  private async store(stage: FailureStage, view: View<P>): Promise<void> {
    this.state.saving = true;
    try {
      await this.wiring.save?.(view, this);
    } catch (cause) {
      this.fail(stage, cause);
    } finally {
      this.state.saving = false;
    }
  }

  private replace(view: View<P>): void {
    this.state.views = this.views.map((held) =>
      held.id === view.id ? view : held,
    );
  }

  async save(): Promise<void> {
    const current = this.current;
    if (!current || current.origin !== "user") {
      throw new Error(`views "${this.id}": the active view cannot be saved`);
    }
    const view: View<P> = { ...current, payload: this.payload };
    await this.store("save", view);
    this.replace(view);
    this.emitter.emit("saved", { id: this.id, view, created: false });
  }

  async saveAs(name: string): Promise<View<P>> {
    const view: View<P> = {
      id: (this.wiring.key ?? (() => crypto.randomUUID()))(),
      name: this.named(name),
      origin: "user",
      payload: this.payload,
    };
    await this.store("save", view);
    const from = this.active;
    this.state.views = [...this.views, view];
    this.state.active = view.id;
    this.emitter.emit("saved", { id: this.id, view, created: true });
    this.emitter.emit("selected", { id: this.id, view, from });
    return view;
  }

  async rename(id: string, name: string): Promise<void> {
    const held = this.find(id);
    if (!held || held.origin !== "user") {
      throw new Error(`views "${this.id}": view "${id}" cannot be renamed`);
    }
    const view: View<P> = { ...held, name: this.named(name) };
    if (view.name === held.name) return;
    await this.store("rename", view);
    this.replace(view);
    this.emitter.emit("renamed", { id: this.id, view });
  }

  private named(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) throw new Error(`views "${this.id}": a view needs a name`);
    return trimmed;
  }

  async remove(id: string, { force = false }: Force = {}): Promise<void> {
    const stale = this.stale.find((view) => view.id === id);
    const held = stale ?? this.find(id);
    if (!held || held.origin !== "user") {
      throw new Error(`views "${this.id}": view "${id}" cannot be removed`);
    }
    if (!force) {
      this.state.pending = { kind: "remove", id };
      return;
    }

    this.state.saving = true;
    try {
      await this.wiring.remove?.(held, this);
    } catch (cause) {
      this.fail("remove", cause);
    } finally {
      this.state.saving = false;
    }

    if (stale) {
      this.state.stale = this.stale.filter((view) => view.id !== id);
    } else {
      this.state.views = this.views.filter((view) => view.id !== id);
    }
    this.emitter.emit("removed", { id: this.id, view: held });

    if (id !== this.active) return;
    const next = this.views[0];
    if (next) await this.go(next.id);
    else this.state.active = null;
  }

  // --- confirmation ----------------------------------------------------

  async resolve(resolution: Resolution, name?: string): Promise<void> {
    const intent = this.pending;
    if (!intent) return;
    if (resolution === "cancel") {
      this.state.pending = null;
      return;
    }

    if (resolution === "save") {
      if (intent.kind !== "select") {
        throw new Error(`views "${this.id}": a ${intent.kind} cannot save`);
      }
      // Stored first: a failure throws from here, before anything is lost.
      if (this.editable) await this.save();
      else await this.saveAs(name ?? "");
    }

    if (intent.kind === "select") await this.go(intent.id);
    else if (intent.kind === "revert") await this.revert({ force: true });
    else await this.remove(intent.id, { force: true });
    this.state.pending = null;
  }
}
