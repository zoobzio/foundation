import type { NuxtApp } from "#app";
import type {
  Actions,
  Config,
  Layout,
  Service,
  Slot,
  State,
} from "#foundation/types/system/workspace";
import type { Widgets } from "#foundation/types/widget";
import type { Logger } from "#foundation/types/log";

export class WorkspaceService<R extends Widgets> implements Service<R> {
  private readonly log: Logger;
  private readonly emit: NuxtApp["callHook"];

  constructor(
    nuxt: NuxtApp,
    public readonly id: string,
    public readonly config: Config<R>,
    private readonly state: State<R>,
    private readonly actions: Actions<R>,
  ) {
    this.log = nuxt.$logger(this.id);
    this.emit = nuxt.callHook;
  }

  get initialized(): boolean {
    return this.state.initialized.value;
  }

  get loading(): boolean {
    return this.state.loading.value;
  }

  get layout(): Layout<R> {
    return this.state.layout.value;
  }

  get gridStyle(): Record<string, string> {
    return {
      display: "grid",
      "grid-template-columns": `repeat(${this.layout.columns}, 1fr)`,
      "grid-template-rows": `repeat(${this.layout.rows}, 1fr)`,
    };
  }

  slotStyle(slot: Slot<R>): Record<string, string> {
    return {
      "grid-column": `${slot.position[0] + 1} / span ${slot.span[0]}`,
      "grid-row": `${slot.position[1] + 1} / span ${slot.span[1]}`,
    };
  }

  async init(): Promise<boolean> {
    if (this.state.initialized.value) return true;
    this.state.loading.value = true;
    try {
      await this.actions.init?.(this);
      this.state.initialized.value = true;
    } finally {
      this.state.loading.value = false;
    }
    this.log.debug("Workspace initialized", { id: this.id });
    this.emit("workspace:initialized", { id: this.id });
    return true;
  }
}
