import type {
  Change as KitChange,
  Changers as KitChangers,
  Changes as KitChanges,
  Listener as KitListener,
  Middleware as KitMiddleware,
  Options as KitOptions,
} from "@zoobzio/kit";

import type { ZodType } from "zod";

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
 * Text-like inputs (text, email, password, tel, url).
 */
export type TextField<T> = FieldBase<T, string> & {
  type: "text" | "email" | "password" | "tel" | "url";
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
 * Native date and time inputs. The value is the input's string form:
 * `HH:mm` for `time`, `YYYY-MM-DDTHH:mm` for `datetime-local`, and
 * `YYYY-MM-DD` for `date-input`, which renders `<input type="date">`.
 * `min` and `max` take the same string form. `step` is in seconds, or in
 * days for `date-input`, as the native attribute reads it. For a `Date`
 * value and a calendar, use `date`.
 */
export type TemporalField<T> = FieldBase<T, string> & {
  type: "time" | "datetime-local" | "date-input";
  min?: string;
  max?: string;
  step?: number;
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
  | TemporalField<T>
  | TagsInputField<T>;

/**
 * Config the consumer provides — the fields, the Zod schema (the form's
 * intrinsic contract), and the default payload.
 */
export type Config<T> = {
  title: string;
  fields: Field<T>[];
  schema: ZodType<T> & { shape: Record<string, ZodType> };
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
 * The kit's state mechanisms bound to this service's container: per-field
 * middleware, the read/write options, and the change objects.
 */
export type Middleware<T> = KitMiddleware<State<T>>;
export type Options<T> = KitOptions<State<T>>;
export type Changes<T> = KitChanges<State<T>>;
export type Change<T, K extends StateKey = StateKey> = KitChange<State<T>, K>;
export type Changers<T> = KitChangers<State<T>>;

/**
 * One field's slice of the state: its payload value, its error once the
 * field is touched, and whether it has been touched.
 */
export type FieldState<V> = {
  value: V | undefined;
  error: string | undefined;
  touched: boolean;
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

export type Listener<T, E extends Event<T>> = KitListener<Events<T>, E>;

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

  /**
   * One field's slice of the state. `error` is gated on `touched`: an
   * untouched field reports no error even when `errors` holds one.
   */
  field<K extends keyof T>(key: K): FieldState<T[K]>;

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
