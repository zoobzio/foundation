import type {
  Actions,
  Config,
  ContentVariant,
  Emitter,
  Event,
  Events,
  Listener,
  Options,
  PreviewField,
  Service,
  State,
} from "./types";

import { makeEmitter } from "./emitter";
import { makeProxy } from "./proxy";

/**
 * The headless preview machine. Owns one record and its load flag;
 * delegates data loading to `actions.fetch`.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container can be a plain object or a reactive proxy; the
 * service replaces each member as a whole. Each write emits `change`, and
 * `fetch` emits `loaded`. `on` subscribes.
 */
export class PreviewService<T> implements Service<T> {
  private readonly state: State<T>;
  private readonly emitter: Emitter<Events<T>> = makeEmitter();

  constructor(
    public readonly id: string,
    public readonly config: Config<T>,
    state: State<T>,
    private readonly actions: Actions<T>,
    options: Options<T> = {},
  ) {
    this.state = makeProxy(state, options, this.emitter);
  }

  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- config ----------------------------------------------------------

  get fields(): PreviewField<T>[] {
    return this.config.fields;
  }

  get content(): ContentVariant<T> {
    return this.config.content;
  }

  // --- state -----------------------------------------------------------

  get initialized(): boolean {
    return this.state.initialized;
  }

  get loading(): boolean {
    return this.state.loading;
  }

  get data(): T | null {
    return this.state.data;
  }

  // --- derived ---------------------------------------------------------

  get contentValue(): string {
    const d = this.data;
    if (!d) return "";
    return String(d[this.config.content.key]);
  }

  fieldValue(key: keyof T): unknown {
    const d = this.data;
    if (!d) return "";
    return d[key];
  }

  // --- loading ---------------------------------------------------------

  async init(): Promise<boolean> {
    if (this.initialized) return true;
    this.state.initialized = true;
    await this.fetch();
    return true;
  }

  async fetch(): Promise<void> {
    this.state.loading = true;
    try {
      this.state.data = await this.actions.fetch(this);
    } finally {
      this.state.loading = false;
      this.emitter.emit("loaded", { id: this.id });
    }
  }
}
