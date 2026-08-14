import type { NuxtApp } from "#app";
import type {
  Config,
  State,
  Actions,
  Service,
  Keys,
} from "../types/data/form";
import type { Logger } from "../types/log";

import { keys } from "objectively";
import { check, flatten } from "../utils/schema";

export class FormService<T> implements Service<T> {
  private readonly log: Logger;
  private readonly emit: NuxtApp["callHook"];

  constructor(
    nuxt: NuxtApp,
    public readonly id: string,
    public readonly config: Config<T>,
    private readonly state: State<T>,
    private readonly actions: Actions<T>,
  ) {
    this.log = nuxt.$logger(this.id);
    this.emit = nuxt.callHook;
  }

  get initialized(): boolean {
    return this.state.initialized.value;
  }

  get payload(): Partial<T> {
    return this.state.payload.value;
  }

  set payload(data: Partial<T>) {
    this.update(data);
  }

  get errors(): Record<string, string> {
    return this.state.errors.value;
  }

  get touched(): Set<string> {
    return this.state.touched.value;
  }

  get submitting(): boolean {
    return this.state.submitting.value;
  }

  get submitted(): boolean {
    return this.state.submitted.value;
  }

  get valid(): boolean {
    return this.config.schema.safeParse(this.payload).success;
  }

  async initialize(): Promise<boolean> {
    if (this.state.initialized.value) return true;

    if (this.actions.init) {
      this.log.debug("Form initializing", { id: this.id });
      try {
        await this.actions.init(this);
      } catch (cause) {
        this.log.error("Failed to initialize form", {
          id: this.id,
          config: this.config,
          cause,
        });
        throw cause;
      }
    }

    this.emit("form:initialized", {
      id: this.id,
      data: this.payload,
    });

    return (this.state.initialized.value = true);
  }

  check(key: keyof T): boolean {
    const k = String(key);
    const message = check(this.config.schema, k, this.payload[key]);

    const { [k]: _, ...rest } = this.state.errors.value;
    this.state.errors.value = message ? { ...rest, [k]: message } : rest;

    return message === undefined;
  }

  validate(payload: Partial<T> = this.payload): boolean {
    const result = this.config.schema.safeParse(payload);
    if (result.success) return true;

    const fieldErrors = flatten(result.error);
    this.state.errors.value = fieldErrors;

    const allKeys = this.config.fields.map((f) => String(f.key));
    this.state.touched.value = new Set(allKeys);

    this.log.debug("Form validation failed", {
      id: this.id,
      errors: fieldErrors,
    });

    return false;
  }

  set<K extends keyof T>(key: K, value: T[K] | undefined): void;
  set<V>(key: Keys<T, V>, value: V | undefined): void;
  set<K extends keyof T>(key: K, value: T[K] | undefined): void {
    const action = this.actions.middleware?.[key];
    this.state.payload.value = {
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
    this.log.debug("Form updated", {
      id: this.id,
      payload: this.payload,
    });
  }

  restore(data: T): void {
    try {
      this.config.schema.parse(data);

      this.reset();
      this.update(data);

      this.log.debug("Form restored", {
        id: this.id,
        data,
      });

      this.emit("form:restored", { id: this.id, data });
    } catch (cause) {
      this.log.error("Form restoration failed", { id: this.id, data });
      throw cause;
    }
  }

  touch(key: keyof T): void {
    const next = new Set(this.state.touched.value);
    next.add(String(key));
    this.state.touched.value = next;
  }

  async submit(): Promise<void> {
    if (!this.validate()) {
      this.emit("form:rejected", {
        id: this.id,
        data: this.payload,
        errors: this.state.errors.value,
      });
      return;
    }

    this.state.submitting.value = true;
    this.log.debug("Form submitting", {
      id: this.id,
      payload: this.payload,
    });

    try {
      const data = this.config.schema.parse(this.payload);

      if (this.actions.submit) {
        await this.actions.submit(this);
      }

      this.state.submitted.value = true;
      this.log.debug("Form submitted", { id: this.id, data });

      this.emit("form:submitted", {
        id: this.id,
        data: this.payload,
      });
    } catch (cause) {
      this.log.error("Form submission failed", { id: this.id, cause });
      throw cause;
    } finally {
      this.state.submitting.value = false;
    }
  }

  reset(): void {
    this.state.payload.value = { ...this.config.defaults };
    this.state.errors.value = {};
    this.state.touched.value = new Set();
    this.state.submitted.value = false;
    this.log.debug("Form reset", { id: this.id });
    this.emit("form:reset", { id: this.id, data: this.payload });
  }
}
