import type {
  Change as KitChange,
  ChangeEvents,
  Changers as KitChangers,
  Changes as KitChanges,
  Listener as KitListener,
  Middleware as KitMiddleware,
  Options as KitOptions,
} from "@zoobzio/kit";

/**
 * The values a field's value stage suggests: a list the term narrows, or a
 * provider that builds the list from the term. A provider's result is used
 * as given: it owns the narrowing.
 */
export type Values = readonly string[] | ((term: string) => readonly string[]);

/**
 * A field the query can filter on. With `operators`, a filter on the field
 * carries an operator; `defaultOperator` fills one in when the caller names
 * none. With `values`, the value stage suggests them; without, the value is
 * free entry. An interface, so a layer may widen it by declaration merging
 * (an icon); a property beyond the ones the query reads is carried onto
 * the field's option, so a view that draws the field draws its option the
 * same way.
 */
export interface Field {
  label: string;
  operators?: readonly string[];
  defaultOperator?: string;
  values?: Values;
}

/**
 * A literal the draft composes in one step: a value written between its
 * `open` and `close` characters, `"text"` say, with no stage of its own to
 * suggest from. Its option leads the field panel under `label`; selecting
 * it writes `open` before the term, and typing `close` commits the value.
 * An interface, so a layer may widen it as it widens `Field` (an icon); a
 * property beyond the ones the query reads is carried onto its option.
 */
export interface Literal {
  label: string;
  open: string;
  close: string;
}

/**
 * Config the consumer provides. Plain data, except that a field's `values`
 * may be a provider. Fields are keyed by the identity a filter carries,
 * literals by the identity a literal entry carries.
 */
export type Config = {
  fields: Record<string, Field>;
  /**
   * The literals the draft accepts. Defaults to the text literal alone,
   * `{ text: QUERY_TEXT_LITERAL }`, the quoted free text `text` reads. An
   * empty record accepts none: the field panel offers no literal option
   * and a quote is a character.
   */
  literals?: Record<string, Literal>;
};

/**
 * A committed field filter: the field key, its value, and the operator of
 * an operator field.
 */
export type Filter = {
  key: string;
  op?: string;
  value: string;
};

/**
 * A committed entry: a literal, or a field filter. The query holds one
 * entry per literal and one filter per field and operator.
 */
export type Entry =
  | { kind: "literal"; key: string; value: string }
  | ({ kind: "filter" } & Filter);

/**
 * The state container the service reads and writes: the committed entries
 * and the draft text. The container can be a plain object or a reactive
 * proxy.
 */
export type State = {
  entries: Entry[];
  draft: string;
};

export type StateKey = keyof State;

export type Middleware = KitMiddleware<State>;
export type Options = KitOptions<State>;
export type Changes = KitChanges<State>;
export type Change<K extends StateKey = StateKey> = KitChange<State, K>;
export type Changers = KitChangers<State>;

/**
 * The stage the draft is at. `field` names a field, `op` picks an
 * operator, `value` enters the value, `literal` composes a literal. The
 * literal stage is terminal: it suggests nothing and adds no trail, so a
 * panel view has nothing to show while the literal is typed.
 */
export type Stage = "field" | "op" | "value" | "literal";

/**
 * The draft parsed against the fields and literals. `key` and `field` are
 * set when the draft starts with a field's label and a colon, and `op`
 * when an operator field's draft names an operator next. `key` and
 * `literal` are set when the draft opens with a literal's `open` instead.
 * `term` is the rest: after the operator, or within the literal's
 * characters.
 */
export type Parse = {
  key?: string;
  field?: Field;
  op?: string;
  literal?: Literal;
  term: string;
};

/**
 * A panel option. `value` is the stage's payload: a field key, an operator,
 * a value, or a literal key. `active` marks the trail option whose stage
 * the draft is in. A field or operator option enters a stage on select,
 * so a view may draw it as a branch, and an active one steps back out. A
 * literal option opens the literal, which is terminal; a value option
 * commits. An interface, so a layer may widen it as it widens `Field` and
 * `Literal`: a field or literal option carries the widened properties.
 */
export interface Option {
  stage: Stage;
  value: string;
  label: string;
  active?: boolean;
}

/**
 * The events of a query service, keyed by name.
 *
 * - `change`: a field of the container was written.
 * - `changed`: the committed entries changed.
 */
export type Events = ChangeEvents<State> & {
  changed: [event: { id: string; entries: Entry[] }];
};

export type Event = keyof Events;

export type Listener<E extends Event> = KitListener<Events, E>;

/**
 * The query machine: the committed entries any view adds to and removes
 * from, plus a draft a text view composes an entry through. `text` is the
 * value of the entry of the `text` literal, the quoted free text.
 */
export type Service = {
  readonly id: string;
  readonly config: Config;
  readonly fields: Record<string, Field>;
  readonly literals: Record<string, Literal>;

  readonly entries: Entry[];
  readonly draft: string;

  readonly text: string;
  readonly filters: Filter[];

  readonly parse: Parse;
  readonly stage: Stage;
  readonly items: Option[];
  readonly trail: Option[][];
  readonly panels: Option[][];
  readonly hint: string;

  add(entry: Entry): boolean;
  remove(index: number): void;
  clear(): void;

  setDraft(text: string): void;
  reset(): void;
  select(option: Option): void;
  submit(): void;
  unwrap(): void;

  stageText(key: string, op?: string): string;
  textFor(entry: Entry): string;
  labelFor(entry: Entry): string;

  on<E extends Event>(event: E, listener: Listener<E>): () => void;
};
