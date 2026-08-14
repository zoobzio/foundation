import type { NuxtApp } from "#app";
import type {
  Config,
  EmitName,
  Service,
  State,
  Wrapped,
} from "#foundation/types/data/adapter";
import type { Logger } from "#foundation/types/log";

import { keys } from "objectively";

export class AdapterService<P extends object> implements Service<P> {
  private readonly log: Logger;
  private readonly emit: NuxtApp["callHook"];
  public readonly emits: readonly EmitName<P>[];

  constructor(
    nuxt: NuxtApp,
    public readonly id: string,
    public readonly config: Config<P>,
    private readonly state: State<P>,
  ) {
    this.log = nuxt.$logger(this.id);
    this.emit = nuxt.callHook;
    this.emits = keys(config.emits);
  }

  get component(): Wrapped<P> {
    return this.config.component;
  }

  get props(): Partial<P> {
    return this.state.props.value;
  }

  patch(props: Partial<P>): void {
    this.state.props.value = { ...this.state.props.value, ...props };
    this.log.debug("Props patched", { id: this.id });
  }

  reset(): void {
    this.state.props.value = {};
    this.log.debug("Props reset", { id: this.id });
  }

  emitted(emit: EmitName<P>, args: unknown[]): void {
    this.log.debug("Emit bridged", { id: this.id, emit });
    this.emit("adapter:emitted", { id: this.id, emit, args });
  }
}
