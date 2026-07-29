import type { ComputedRef, Ref } from "#imports";
import type { FormSnapshot } from "#foundation/schemas/form";
import type { Option } from "#foundation/types/core/common";
import type { ZodType } from "zod";

/**
 * Colspan over a 12-column grid.
 */
export type Colspan = 2 | 3 | 4 | 6 | 8 | 9 | 10 | 12;

/**
 * Shared base for all field variants.
 */
export interface FieldBase<T> {
  key: keyof T;
  label: string;
  disabled?: boolean;
  required?: boolean;
  colspan?: Colspan;
}

/**
 * Text-like inputs (text, email, password).
 */
export interface TextField<T> extends FieldBase<T> {
  type: "text" | "email" | "password";
  placeholder?: string;
  maxLength?: number;
}

/**
 * Numeric input.
 */
export interface NumberField<T> extends FieldBase<T> {
  type: "number";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Textarea input.
 */
export interface TextareaField<T> extends FieldBase<T> {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

/**
 * Single select.
 */
export interface SelectField<T> extends FieldBase<T> {
  type: "select";
  placeholder?: string;
  options: Option[];
}

/**
 * Multi select.
 */
export interface MultiSelectField<T> extends FieldBase<T> {
  type: "multi-select";
  placeholder?: string;
  options: Option[];
}

/**
 * Checkbox (boolean).
 */
export interface CheckboxField<T> extends FieldBase<T> {
  type: "checkbox";
}

/**
 * Radio group.
 */
export interface RadioField<T> extends FieldBase<T> {
  type: "radio";
  options: Option[];
  orientation?: "horizontal" | "vertical";
}

/**
 * Date picker.
 */
export interface DateField<T> extends FieldBase<T> {
  type: "date";
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * Tags input.
 */
export interface TagsInputField<T> extends FieldBase<T> {
  type: "tags-input";
  placeholder?: string;
  max?: number;
  delimiter?: string;
}

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
export interface Config<T> {
  title: string;
  fields: Field<T>[];
  schema: ZodType<T>;
  defaults?: Partial<T>;
}

export interface State<T> {
  initialized: Ref<boolean>;
  values: Ref<Partial<T>>;
  errors: Ref<Record<string, string>>;
  touched: Ref<Set<string>>;
  submitting: Ref<boolean>;
  submitted: Ref<boolean>;
}

export interface Actions<T> {
  init?: (state: State<T>) => Promise<void>;
  submit?: (state: State<T>) => Promise<void>;
}

/**
 * The reactive interface for a data form.
 * Returned by the form factory. Components accept this as their prop.
 */
export interface Form<T> {
  id: string;
  config: Config<T>;

  initialized: Ref<boolean>;
  values: Ref<Partial<T>>;
  errors: Ref<Record<string, string>>;
  touched: Ref<Set<string>>;
  submitting: Ref<boolean>;
  submitted: Ref<boolean>;
  valid: ComputedRef<boolean>;

  initialize: () => Promise<boolean>;
  set: (key: keyof T, value: unknown) => void;
  update: (data: Partial<T>) => void;
  touch: (key: keyof T) => void;
  validate: (key?: keyof T) => boolean;
  submit: () => Promise<void>;
  reset: () => void;
  snap: () => FormSnapshot;
  restore: (snapshot: FormSnapshot) => void;
}
