import type { ZodObject, ZodRawShape, ZodTypeAny, UnknownKeysParam } from "zod";

/**
 * A selectable item of a select, multi-select, or radio field. Structurally
 * identical to the view-side option shape, so a field's options bind
 * straight to the control.
 */
export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Colspan over a 12-column grid.
 */
export type Colspan = 2 | 3 | 4 | 6 | 8 | 9 | 10 | 12;

/**
 * Keys of `T` whose value accepts `V` — what ties a field variant to the
 * payload properties its control can write. `V` is wrapped in a tuple so
 * union values (`boolean`) don't distribute.
 */
export type Keys<T, V> = {
  [K in keyof T]-?: [V] extends [T[K]] ? K : never;
}[keyof T];

/**
 * Shared base for all field variants. `V` is the value type the variant's
 * control writes; `key` may only point at a payload property that accepts it.
 */
export type FieldBase<T, V> = {
  key: Keys<T, V>;
  label: string;
  disabled?: boolean;
  required?: boolean;
  colspan?: Colspan;
};

/**
 * Text-like inputs (text, email, password).
 */
export type TextField<T> = FieldBase<T, string> & {
  type: "text" | "email" | "password";
  placeholder?: string;
  maxLength?: number;
};

/**
 * Numeric input.
 */
export type NumberField<T> = FieldBase<T, number> & {
  type: "number";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
};

/**
 * Textarea input.
 */
export type TextareaField<T> = FieldBase<T, string> & {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  maxLength?: number;
};

/**
 * Single select.
 */
export type SelectField<T> = FieldBase<T, string> & {
  type: "select";
  placeholder?: string;
  options: Option[];
};

/**
 * Multi select.
 */
export type MultiSelectField<T> = FieldBase<T, string[]> & {
  type: "multi-select";
  placeholder?: string;
  options: Option[];
};

/**
 * Checkbox (boolean).
 */
export type CheckboxField<T> = FieldBase<T, boolean> & {
  type: "checkbox";
};

/**
 * Radio group.
 */
export type RadioField<T> = FieldBase<T, string> & {
  type: "radio";
  options: Option[];
  orientation?: "horizontal" | "vertical";
};

/**
 * Date picker.
 */
export type DateField<T> = FieldBase<T, Date> & {
  type: "date";
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
};

/**
 * Tags input.
 */
export type TagsInputField<T> = FieldBase<T, string[]> & {
  type: "tags-input";
  placeholder?: string;
  max?: number;
  delimiter?: string;
};

/**
 * Discriminated union of all field types.
 */
export type Field<T> =
  | TextField<T>
  | NumberField<T>
  | TextareaField<T>
  | SelectField<T>
  | MultiSelectField<T>
  | CheckboxField<T>
  | RadioField<T>
  | DateField<T>
  | TagsInputField<T>;

/**
 * Config the consumer provides — the fields, the Zod schema (the form's
 * intrinsic contract), and the default payload.
 */
export type Config<T> = {
  title: string;
  fields: Field<T>[];
  schema: ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny, T>;
  defaults?: Partial<T>;
};

/**
 * The state container the service reads and writes: the payload, the
 * per-key errors, the touched keys, and the lifecycle flags. The container
 * can be a plain object or a reactive proxy. The service replaces each
 * member as a whole, so a proxy tracks every change.
 */
export type State<T> = {
  initialized: boolean;
  payload: Partial<T>;
  errors: Record<string, string>;
  touched: Set<string>;
  submitting: boolean;
  submitted: boolean;
};

export type StateKey = keyof State<unknown>;

/**
 * One middleware slot per state field. A slot receives the value of its
 * field and returns the value the service uses. A missing slot passes the
 * value on.
 */
export type Middleware<T> = {
  [K in StateKey]?: (value: State<T>[K]) => State<T>[K];
};

/**
 * The middleware for reads and writes of the state container.
 */
export type Options<T> = {
  get?: { state?: Middleware<T> };
  set?: { state?: Middleware<T> };
};

/**
 * The consumer-supplied behavior: the optional init/submit lifecycle and
 * per-key value middleware applied on `set`.
 */
export type Actions<T> = {
  init?: (service: Service<T>) => Promise<void>;
  submit?: (service: Service<T>) => Promise<void>;
  middleware?: {
    [K in keyof T]?: (value: T[K]) => T[K];
  };
};

/**
 * The change object of each field: the field name with the stored values
 * around the write, after the `set` middleware.
 */
export type Changes<T> = {
  [K in keyof State<T>]: { field: K; before: State<T>[K]; after: State<T>[K] };
};

/**
 * A write to one field of the container. With no `K`, the union over every
 * field; `field` discriminates.
 */
export type Change<T, K extends StateKey = StateKey> = Changes<T>[K];

/**
 * The change builder of each field. A lookup by a generic key yields the
 * change object of that field, which an object literal cannot express
 * without a cast.
 */
export type Changers<T> = {
  [K in keyof State<T>]: (
    field: K,
    before: State<T>[K],
    after: State<T>[K],
  ) => Changes<T>[K];
};

/**
 * An event map: each key is an event name, each value the argument list of
 * its listeners.
 */
export type EventMap = Record<string, unknown[]>;

/**
 * A typed event bus over an event map.
 */
export type Emitter<M extends EventMap> = {
  /**
   * Subscribes a listener to an event. Returns the function that removes it.
   */
  on: <E extends keyof M>(
    event: E,
    listener: (...args: M[E]) => void,
  ) => () => void;
  /**
   * Calls the listeners of an event, in subscription order, over a copy, so
   * a listener can unsubscribe during the call.
   */
  emit: <E extends keyof M>(event: E, ...args: M[E]) => void;
  /**
   * Whether an event has a listener. Skips the work of an event payload when
   * nothing listens.
   */
  heard: (event: keyof M) => boolean;
};

/**
 * The stage of the lifecycle a failure came from.
 */
export type FailureStage = "init" | "restore" | "submit";

/**
 * The events of a form service, keyed by name. Each value is the argument
 * list of a listener. The service emits after the write lands, so a listener
 * reads the new state.
 *
 * - `change`: any field of the container was written.
 * - `initialized`: the init lifecycle ran. `data` is the payload.
 * - `submitted`: the submit action settled on a valid payload.
 * - `rejected`: submit stopped on validation. `errors` is the error record.
 * - `restored`: a record passed the schema and replaced the payload.
 * - `reset`: the payload returned to the defaults.
 * - `failed`: the init action, a restore, or the submit action threw. The
 *   error is rethrown to the caller after the event; `cause` carries it.
 */
export type Events<T> = {
  change: [change: Change<T>];
  initialized: [event: { id: string; data: Partial<T> }];
  submitted: [event: { id: string; data: Partial<T> }];
  rejected: [
    event: { id: string; data: Partial<T>; errors: Record<string, string> },
  ];
  restored: [event: { id: string; data: T }];
  reset: [event: { id: string; data: Partial<T> }];
  failed: [event: { id: string; stage: FailureStage; cause: unknown }];
};

export type Event<T> = keyof Events<T>;

export type Listener<T, E extends Event<T>> = (...args: Events<T>[E]) => void;

export type Listeners<M extends EventMap> = {
  [E in keyof M]?: Set<(...args: M[E]) => void>;
};

/**
 * The imperative contract: unwrapped state + derived + the full method
 * surface. `FormService<T>` declares `implements` against this, and the
 * actions receive it.
 */
export type Service<T> = {
  readonly id: string;
  readonly config: Config<T>;

  readonly initialized: boolean;
  // Writable accessor pair — sets route through `update`.
  payload: Partial<T>;
  readonly errors: Record<string, string>;
  readonly touched: Set<string>;
  readonly submitting: boolean;
  readonly submitted: boolean;
  readonly valid: boolean;

  initialize(): Promise<boolean>;
  check(key: keyof T): boolean;
  validate(payload?: Partial<T>): boolean;
  /**
   * The value-first overload serves code generic over `T` (the control
   * recipes): the checker cannot prove `V` assignable to `T[Keys<T, V>]`
   * for an unresolved `T`, but `Keys` guarantees it at every instantiation.
   * At concrete `T` a mismatched pair fails both overloads.
   */
  set: {
    <K extends keyof T>(key: K, value: T[K] | undefined): void;
    <V>(key: Keys<T, V>, value: V | undefined): void;
  };
  update(data: Partial<T>): void;
  restore(data: T): void;
  touch(key: keyof T): void;
  submit(): Promise<void>;
  reset(): void;

  /**
   * Subscribes a listener to an event. Listeners run in subscription order.
   * An error in a listener propagates to the caller of the write. Returns a
   * function that removes the listener.
   */
  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void;
};
