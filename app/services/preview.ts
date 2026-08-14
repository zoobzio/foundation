import type { NuxtApp } from "#app";
import type {
  Actions,
  Config,
  ContentVariant,
  PreviewField,
  Service,
  State,
} from "../types/data/preview";
import type { Logger } from "../types/log";

export class PreviewService<T> implements Service<T> {
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

  get fields(): PreviewField<T>[] {
    return this.config.fields;
  }

  get content(): ContentVariant<T> {
    return this.config.content;
  }

  get initialized(): boolean {
    return this.state.initialized.value;
  }

  get loading(): boolean {
    return this.state.loading.value;
  }

  get data(): T | null {
    return this.state.data.value;
  }

  get contentValue(): string {
    const d = this.state.data.value;
    if (!d) return "";
    return String(d[this.config.content.key]);
  }

  fieldValue(key: keyof T): unknown {
    const d = this.state.data.value;
    if (!d) return "";
    return d[key];
  }

  async init(): Promise<boolean> {
    if (this.state.initialized.value) return true;
    this.state.initialized.value = true;
    await this.fetch();
    return true;
  }

  async fetch(): Promise<void> {
    this.state.loading.value = true;
    try {
      this.state.data.value = await this.actions.fetch(this);
    } finally {
      this.state.loading.value = false;
      this.log.debug("Preview loaded", { id: this.id });
      this.emit("preview:loaded", { id: this.id });
    }
  }
}
