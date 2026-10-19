import type {
  Actions,
  Config,
  Emitter,
  Event,
  Events,
  Keys,
  Listener,
  Options,
  Service,
  State,
} from "./types";

import { keys } from "objectively";
import { makeEmitter } from "./emitter";
import { makeProxy } from "./proxy";
import { check, flatten } from "./util";

/**
 * The headless form machine. Owns the payload, per-key validation against
 * the Zod schema, the touched set, and the submit lifecycle; delegates the
 * init and submit side effects to `actions`.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container can be a plain object or a reactive proxy; the
 * service replaces each member as a whole. Each write emits `change`, and
 * the lifecycle methods emit `initialized`, `submitted`, `rejected`,
 * `restored`, `reset`, and `failed`. `on` subscribes.
 */
export class FormService<T> implements Service<T> {
  private readonly state: State<T>;
  private readonly emitter: Emitter<Events<T>> = makeEmitter();

  constructor(
    public readonly id: string,
    public readonly config: Config<T>,
    state: State<T>,
    private readonly actions: Actions<T> = {},
    options: Options<T> = {},
  ) {
    this.state = makeProxy(state, options, this.emitter);
  }

  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- state -----------------------------------------------------------

  get initialized(): boolean {
    return this.state.initialized;
  }
  get payload(): Partial<T> {
    return this.state.payload;
  }
  set payload(data: Partial<T>) {
    this.update(data);
  }
  get errors(): Record<string, string> {
    return this.state.errors;
  }
  get touched(): Set<string> {
    return this.state.touched;
  }
  get submitting(): boolean {
    return this.state.submitting;
  }
  get submitted(): boolean {
    return this.state.submitted;
  }

  // --- derived ---------------------------------------------------------

  get valid(): boolean {
    return this.config.schema.safeParse(this.payload).success;
  }

  // --- lifecycle -------------------------------------------------------

  async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    if (this.actions.init) {
      try {
        await this.actions.init(this);
      } catch (cause) {
        this.emitter.emit("failed", { id: this.id, stage: "init", cause });
        throw cause;
      }
    }

    this.state.initialized = true;
    this.emitter.emit("initialized", { id: this.id, data: this.payload });
    return true;
  }

  // --- validation ------------------------------------------------------

  check(key: keyof T): boolean {
    const k = String(key);
    const message = check(this.config.schema, k, this.payload[key]);

    const { [k]: _, ...rest } = this.errors;
    this.state.errors = message ? { ...rest, [k]: message } : rest;

    return message === undefined;
  }

  validate(payload: Partial<T> = this.payload): boolean {
    const result = this.config.schema.safeParse(payload);
    if (result.success) return true;

    this.state.errors = flatten(result.error);
    this.state.touched = new Set(this.config.fields.map((f) => String(f.key)));
    return false;
  }

  // --- payload ---------------------------------------------------------

  set<K extends keyof T>(key: K, value: T[K] | undefined): void;
  set<V>(key: Keys<T, V>, value: V | undefined): void;
  set<K extends keyof T>(key: K, value: T[K] | undefined): void {
    const action = this.actions.middleware?.[key];
    this.state.payload = {
      ...this.payload,
      [key]: action && value !== undefined ? action(value) : value,
    };
  }

  update(data: Partial<T>): void {
    for (const key of keys(data)) {
      const value = data[key];
      if (value === undefined) continue;
      this.set(key, value);
    }
  }

  restore(data: T): void {
    try {
      this.config.schema.parse(data);
    } catch (cause) {
      this.emitter.emit("failed", { id: this.id, stage: "restore", cause });
      throw cause;
    }
    this.reset();
    this.update(data);
    this.emitter.emit("restored", { id: this.id, data });
  }

  touch(key: keyof T): void {
    const next = new Set(this.touched);
    next.add(String(key));
    this.state.touched = next;
  }

  // --- submit ----------------------------------------------------------

  async submit(): Promise<void> {
    if (!this.validate()) {
      this.emitter.emit("rejected", {
        id: this.id,
        data: this.payload,
        errors: this.errors,
      });
      return;
    }

    this.state.submitting = true;
    try {
      this.config.schema.parse(this.payload);
      if (this.actions.submit) {
        await this.actions.submit(this);
      }
      this.state.submitted = true;
      this.emitter.emit("submitted", { id: this.id, data: this.payload });
    } catch (cause) {
      this.emitter.emit("failed", { id: this.id, stage: "submit", cause });
      throw cause;
    } finally {
      this.state.submitting = false;
    }
  }

  reset(): void {
    this.state.payload = { ...this.config.defaults };
    this.state.errors = {};
    this.state.touched = new Set();
    this.state.submitted = false;
    this.emitter.emit("reset", { id: this.id, data: this.payload });
  }
}
