import type { ComputedRef, Ref } from "#imports";
import type { DataFormSnapshot } from "#foundation/schemas/data/form";
import type { Option } from "#foundation/types/core/common";
import type { ZodType } from "zod";

/**
 * Colspan over a 12-column grid.
 */
export type FormColspan = 2 | 3 | 4 | 6 | 8 | 9 | 10 | 12;

/**
 * Shared base for all field variants.
 */
export interface DataFormFieldBase<T> {
  key: keyof T;
  label: string;
  disabled?: boolean;
  required?: boolean;
  colspan?: FormColspan;
}

/**
 * Text-like inputs (text, email, password).
 */
export interface DataFormTextField<T> extends DataFormFieldBase<T> {
  type: "text" | "email" | "password";
  placeholder?: string;
  maxLength?: number;
}

/**
 * Numeric input.
 */
export interface DataFormNumberField<T> extends DataFormFieldBase<T> {
  type: "number";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Textarea input.
 */
export interface DataFormTextareaField<T> extends DataFormFieldBase<T> {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

/**
 * Single select.
 */
export interface DataFormSelectField<T> extends DataFormFieldBase<T> {
  type: "select";
  placeholder?: string;
  options: Option[];
}

/**
 * Multi select.
 */
export interface DataFormMultiSelectField<T> extends DataFormFieldBase<T> {
  type: "multi-select";
  placeholder?: string;
  options: Option[];
}

/**
 * Checkbox (boolean).
 */
export interface DataFormCheckboxField<T> extends DataFormFieldBase<T> {
  type: "checkbox";
}

/**
 * Radio group.
 */
export interface DataFormRadioField<T> extends DataFormFieldBase<T> {
  type: "radio";
  options: Option[];
  orientation?: "horizontal" | "vertical";
}

/**
 * Date picker.
 */
export interface DataFormDateField<T> extends DataFormFieldBase<T> {
  type: "date";
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * Tags input.
 */
export interface DataFormTagsInputField<T> extends DataFormFieldBase<T> {
  type: "tags-input";
  placeholder?: string;
  max?: number;
  delimiter?: string;
}

/**
 * Discriminated union of all field types.
 */
export type DataFormField<T> =
  | DataFormTextField<T>
  | DataFormNumberField<T>
  | DataFormTextareaField<T>
  | DataFormSelectField<T>
  | DataFormMultiSelectField<T>
  | DataFormCheckboxField<T>
  | DataFormRadioField<T>
  | DataFormDateField<T>
  | DataFormTagsInputField<T>;

/**
 * Config the consumer provides to the factory.
 */
export interface DataFormConfig<T> {
  title: string;
  fields: DataFormField<T>[];
  schema: ZodType<T>;
  submit: (data: T) => Promise<void>;
  defaults?: Partial<T>;
}

/**
 * The reactive interface for a data form.
 * Returned by the form factory. Components accept this as their prop.
 */
export interface Form<T> {
  // State
  values: Ref<Partial<T>>;
  errors: Ref<Record<string, string>>;
  touched: Ref<Set<string>>;
  submitting: Ref<boolean>;
  submitted: Ref<boolean>;
  valid: ComputedRef<boolean>;

  // Config
  readonly title: string;
  readonly fields: DataFormField<T>[];

  // Actions
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  touch: (key: keyof T) => void;
  validate: () => boolean;
  validateField: (key: keyof T) => void;
  submit: () => Promise<void>;
  reset: () => void;
  getSnapshot: () => DataFormSnapshot;
  restoreSnapshot: (snapshot: DataFormSnapshot) => void;
  init: () => Promise<boolean>;
  initialized: Ref<boolean>;
}
