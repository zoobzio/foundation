import type { Ref } from "#imports";
import type { Option } from "#foundation/types/core/common";

/**
 * A single suggestion in the active panel, or a locked step in the breadcrumb.
 * `meta` carries consumer-defined data through to actions untouched.
 */
export type Item<M> = Option & {
  hasChildren?: boolean;
  meta?: M;
};

/**
 * The machine state handed to the config resolvers: the current input string
 * and the locked-step breadcrumb. Resolvers derive suggestions/hint/empty from
 * this, plus whatever external reactive state they close over (e.g. a table's
 * columns and filters).
 */
export type Query<M> = {
  input: string;
  steps: Item<M>[];
};

/**
 * Config the consumer provides to the factory. `suggest` is the only required
 * capability; `hint` and `empty` are optional derivations. All resolvers are
 * synchronous over the current `Query`.
 */
export type Config<M> = {
  placeholder?: string;
  suggest: (query: Query<M>) => Item<M>[];
  hint?: (query: Query<M>) => string;
  empty?: (query: Query<M>) => boolean;
};

export type State<M> = {
  input: Ref<string>;
  steps: Ref<Item<M>[]>;
  focused: Ref<boolean>;
  highlight: Ref<number>;
};

/**
 * The imperative contract for a data autocomplete service: unwrapped state
 * plus the full method surface. `AutocompleteService<M>` declares `implements`
 * against this, and service actions receive it.
 */
export type Service<M> = {
  readonly id: string;
  readonly config: Config<M>;

  // Writable accessor pairs — sets route through the matching mutator.
  input: string;
  steps: Item<M>[];

  readonly focused: boolean;
  readonly highlight: number;

  readonly suggestions: Item<M>[];
  readonly panels: Item<M>[][];
  readonly hint: string;
  readonly empty: boolean;
  readonly dropdown: boolean;
  readonly highlighted: Item<M> | undefined;

  set(value: string): void;
  update(steps: Item<M>[]): void;
  reset(): void;
  focus(): void;
  blur(): void;
  next(): void;
  prev(): void;
  select(item: Item<M>): void;
  submit(value: string): void;
  unwind(index: number): void;
  keydown(event: KeyboardEvent): void;
};

/**
 * Consumer-supplied side effects, invoked by the matching service
 * dispatchers. Each receives the live service so it can drive state as the
 * machine advances or commits.
 */
export type Actions<M> = {
  select?: (item: Item<M>, service: Service<M>) => void;
  submit?: (value: string, service: Service<M>) => void;
  unwind?: (index: number, service: Service<M>) => void;
  keydown?: (event: KeyboardEvent, service: Service<M>) => void;
};

export type Events<M> = {
  "autocomplete:updated": (event: {
    id: string;
    input: string;
    steps: Item<M>[];
  }) => void;
  "autocomplete:selected": (event: { id: string; item: Item<M> }) => void;
  "autocomplete:submitted": (event: { id: string; value: string }) => void;
  "autocomplete:unwound": (event: { id: string; index: number }) => void;
};
