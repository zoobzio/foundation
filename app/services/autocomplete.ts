import type { NuxtApp } from "#app";
import type {
  Config,
  State,
  Actions,
  Service,
  Item,
} from "../types/data/autocomplete";
import type { Logger } from "../types/log";

export class AutocompleteService<M> implements Service<M> {
  private readonly log: Logger;
  private readonly emit: NuxtApp["callHook"];

  constructor(
    nuxt: NuxtApp,
    public readonly id: string,
    public readonly config: Config<M>,
    private readonly state: State<M>,
    private readonly actions: Actions<M>,
  ) {
    this.log = nuxt.$logger(this.id);
    this.emit = nuxt.callHook;
  }

  get input(): string {
    return this.state.input.value;
  }

  set input(value: string) {
    this.set(value);
  }

  get steps(): Item<M>[] {
    return this.state.steps.value;
  }

  set steps(steps: Item<M>[]) {
    this.update(steps);
  }

  get focused(): boolean {
    return this.state.focused.value;
  }

  get highlight(): number {
    return this.state.highlight.value;
  }

  get suggestions(): Item<M>[] {
    return this.config.suggest({ input: this.input, steps: this.steps });
  }

  get panels(): Item<M>[][] {
    if (!this.focused) return [];
    const result: Item<M>[][] = [];
    for (const step of this.steps) {
      result.push([{ ...step, hasChildren: true }]);
    }
    if (this.suggestions.length) result.push(this.suggestions);
    return result;
  }

  get hint(): string {
    return this.config.hint?.({ input: this.input, steps: this.steps }) ?? "";
  }

  get empty(): boolean {
    return (
      this.config.empty?.({ input: this.input, steps: this.steps }) ?? false
    );
  }

  get dropdown(): boolean {
    if (!this.focused) return false;
    return this.panels.length > 0 || this.empty;
  }

  get highlighted(): Item<M> | undefined {
    return this.suggestions[this.highlight];
  }

  set(value: string): void {
    this.state.input.value = value;
    this.rehighlight();
  }

  update(steps: Item<M>[]): void {
    this.state.steps.value = steps;
    this.rehighlight();
    this.log.debug("Autocomplete updated", { id: this.id, steps });
    this.emit("autocomplete:updated", {
      id: this.id,
      input: this.input,
      steps,
    });
  }

  reset(): void {
    this.state.input.value = "";
    this.state.steps.value = [];
    this.rehighlight();
    this.log.debug("Autocomplete reset", { id: this.id });
    this.emit("autocomplete:updated", {
      id: this.id,
      input: this.input,
      steps: this.steps,
    });
  }

  /**
   * Snaps the highlight to the first selectable suggestion. Runs after any
   * mutation that changes the suggestion set, so the highlight never points
   * at a stale or disabled entry.
   */
  private rehighlight(): void {
    const items = this.suggestions;
    let idx = 0;
    while (idx < items.length && items[idx]?.disabled) idx++;
    this.state.highlight.value = idx < items.length ? idx : 0;
  }

  focus(): void {
    this.state.focused.value = true;
  }

  blur(): void {
    this.state.focused.value = false;
  }

  next(): void {
    const items = this.suggestions;
    let next = this.highlight + 1;
    while (next < items.length && items[next]?.disabled) next++;
    if (next < items.length) this.state.highlight.value = next;
  }

  prev(): void {
    const items = this.suggestions;
    let prev = this.highlight - 1;
    while (prev >= 0 && items[prev]?.disabled) prev--;
    if (prev >= 0) this.state.highlight.value = prev;
  }

  select(item: Item<M>): void {
    this.actions.select?.(item, this);
    this.emit("autocomplete:selected", { id: this.id, item });
  }

  submit(value: string): void {
    this.actions.submit?.(value, this);
    this.emit("autocomplete:submitted", { id: this.id, value });
  }

  unwind(index: number): void {
    this.actions.unwind?.(index, this);
    this.emit("autocomplete:unwound", { id: this.id, index });
  }

  keydown(event: KeyboardEvent): void {
    this.actions.keydown?.(event, this);
  }
}
