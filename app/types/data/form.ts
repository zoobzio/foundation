import type { ComputedRef, Ref } from "#imports";
import type { Option } from "#foundation/types/core/common";
import type { ZodObject, ZodRawShape, ZodTypeAny, UnknownKeysParam } from "zod";

/**
 * Colspan over a 12-column grid.
 */
export type Colspan = 2 | 3 | 4 | 6 | 8 | 9 | 10 | 12;

/**
 * Shared base for all field variants.
 */
export type FieldBase<T> = {
  key: keyof T;
  label: string;
  disabled?: boolean;
  required?: boolean;
  colspan?: Colspan;
};

/**
 * Text-like inputs (text, email, password).
 */
export type TextField<T> = FieldBase<T> & {
  type: "text" | "email" | "password";
  placeholder?: string;
  maxLength?: number;
};

/**
 * Numeric input.
 */
export type NumberField<T> = FieldBase<T> & {
  type: "number";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
};

/**
 * Textarea input.
 */
export type TextareaField<T> = FieldBase<T> & {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  maxLength?: number;
};

/**
 * Single select.
 */
export type SelectField<T> = FieldBase<T> & {
  type: "select";
  placeholder?: string;
  options: Option[];
};

/**
 * Multi select.
 */
export type MultiSelectField<T> = FieldBase<T> & {
  type: "multi-select";
  placeholder?: string;
  options: Option[];
};

/**
 * Checkbox (boolean).
 */
export type CheckboxField<T> = FieldBase<T> & {
  type: "checkbox";
};

/**
 * Radio group.
 */
export type RadioField<T> = FieldBase<T> & {
  type: "radio";
  options: Option[];
  orientation?: "horizontal" | "vertical";
};

/**
 * Date picker.
 */
export type DateField<T> = FieldBase<T> & {
  type: "date";
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
};

/**
 * Tags input.
 */
export type TagsInputField<T> = FieldBase<T> & {
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
 * Config the consumer provides to the factory.
 */
export type Config<T> = {
  title: string;
  fields: Field<T>[];
  schema: ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny, T>;
  defaults?: Partial<T>;
};

export type State<T> = {
  initialized: Ref<boolean>;
  payload: Ref<Partial<T>>;
  errors: Ref<Record<string, string>>;
  touched: Ref<Set<string>>;
  submitting: Ref<boolean>;
  submitted: Ref<boolean>;
};

/**
 * The imperative contract for a data form service: unwrapped state plus
 * the full method surface. `FormService<T>` declares `implements` against
 * this, and service actions receive it.
 */
export type Service<T> = {
  readonly id: string;
  readonly config: Config<T>;

  readonly initialized: boolean;
  readonly payload: Partial<T>;
  readonly errors: Record<string, string>;
  readonly touched: Set<string>;
  readonly submitting: boolean;
  readonly submitted: boolean;
  readonly valid: boolean;

  initialize(): Promise<boolean>;
  check(key: keyof T): boolean;
  validate(payload?: Partial<T>): boolean;
  set<K extends keyof T>(key: K, value: T[K]): void;
  update(data: Partial<T>): void;
  restore(data: T): void;
  touch(key: keyof T): void;
  submit(): Promise<void>;
  reset(): void;
};

export type Actions<T> = {
  init?: (service: Service<T>) => Promise<void>;
  submit?: (service: Service<T>) => Promise<void>;
  middleware?: {
    [K in keyof T]?: (value: T[K]) => T[K];
  };
};

export type Events<T> = {
  "form:initialized": (event: { id: string; data: Partial<T> }) => void;
  "form:submitted": (event: { id: string; data: T }) => void;
  "form:rejected": (event: {
    id: string;
    data: Partial<T>;
    errors: Record<string, string>;
  }) => void;
  "form:restored": (event: { id: string; data: T }) => void;
  "form:reset": (event: { id: string; data: Partial<T> }) => void;
};

/**
 * The reactive interface for a data form.
 * Returned by the form factory. Components accept this as their prop.
 */
export type Form<T> = {
  id: string;
  config: Config<T>;

  initialized: Ref<boolean>;
  payload: Ref<Partial<T>>;
  errors: Ref<Record<string, string>>;
  touched: Ref<Set<string>>;
  submitting: Ref<boolean>;
  submitted: Ref<boolean>;
  valid: ComputedRef<boolean>;

  initialize: () => Promise<boolean>;
  check: (key: keyof T) => boolean;
  validate: (data?: Partial<T>) => boolean;
  set: <K extends keyof T>(key: K, value: T[K]) => void;
  update: (data: Partial<T>) => void;
  restore: (data: T) => void;
  touch: (key: keyof T) => void;
  submit: () => Promise<void>;
  reset: () => void;
};
