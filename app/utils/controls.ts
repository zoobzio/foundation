import type {
  Controls,
  ResolvedControl,
} from "#foundation/types/data/controls";
import type {
  CheckboxField,
  DateField,
  Field,
  MultiSelectField,
  NumberField,
  RadioField,
  SelectField,
  TagsInputField,
  TextField,
  TextareaField,
  Service,
} from "#foundation/types/data/form";

import { serialize, deserialize } from "#foundation/utils/date";

/**
 * The natural-language mapping between the form's field config and each
 * control's own contract: one recipe per field variant, fed to `passthrough`
 * as the local layer under the consumer's `pt`.
 */

export const input = <T>(
  form: Service<T>,
  field: TextField<T>,
  value: T[keyof T] | undefined,
  error: string | undefined,
): Controls["input"] => ({
  value: typeof value === "string" ? value : undefined,
  type: field.type,
  placeholder: field.placeholder,
  disabled: field.disabled,
  required: field.required,
  aria: { invalid: !!error },
  onInput: (event) => {
    if (event.target instanceof HTMLInputElement) {
      form.set(field.key, event.target.value);
    }
  },
  onBlur: () => {
    form.touch(field.key);
    form.check(field.key);
  },
});

export const number = <T>(
  form: Service<T>,
  field: NumberField<T>,
  value: T[keyof T] | undefined,
  error: string | undefined,
): Controls["input"] => ({
  value: typeof value === "number" ? value : undefined,
  type: "number",
  placeholder: field.placeholder,
  disabled: field.disabled,
  required: field.required,
  min: field.min,
  max: field.max,
  step: field.step,
  aria: { invalid: !!error },
  onInput: (event) => {
    if (event.target instanceof HTMLInputElement) {
      const parsed = event.target.valueAsNumber;
      form.set(field.key, Number.isNaN(parsed) ? undefined : parsed);
    }
  },
  onBlur: () => {
    form.touch(field.key);
    form.check(field.key);
  },
});

export const textarea = <T>(
  form: Service<T>,
  field: TextareaField<T>,
  value: T[keyof T] | undefined,
  error: string | undefined,
): Controls["textarea"] => ({
  value: typeof value === "string" ? value : undefined,
  placeholder: field.placeholder,
  disabled: field.disabled,
  required: field.required,
  rows: field.rows,
  aria: { invalid: !!error },
  onInput: (event) => {
    if (event.target instanceof HTMLTextAreaElement) {
      form.set(field.key, event.target.value);
    }
  },
  onBlur: () => {
    form.touch(field.key);
    form.check(field.key);
  },
});

export const select = <T>(
  form: Service<T>,
  field: SelectField<T>,
  value: T[keyof T] | undefined,
): Controls["select"] => ({
  modelValue: field.options.find((o) => o.value === value),
  options: field.options,
  placeholder: field.placeholder,
  disabled: field.disabled,
  required: field.required,
  "onUpdate:modelValue": (option) => {
    form.set(field.key, option.value);
    form.touch(field.key);
    form.check(field.key);
  },
});

export const multiselect = <T>(
  form: Service<T>,
  field: MultiSelectField<T>,
  value: T[keyof T] | undefined,
): Controls["multiSelect"] => ({
  modelValue: Array.isArray(value)
    ? field.options.filter((o) => value.includes(o.value))
    : [],
  items: field.options,
  placeholder: field.placeholder,
  disabled: field.disabled,
  "onUpdate:modelValue": (options) => {
    form.set(
      field.key,
      (options ?? []).map((o) => o.value),
    );
    form.touch(field.key);
    form.check(field.key);
  },
});

export const checkbox = <T>(
  form: Service<T>,
  field: CheckboxField<T>,
  value: T[keyof T] | undefined,
): Controls["checkbox"] => ({
  modelValue: !!value,
  disabled: field.disabled,
  "onUpdate:modelValue": (v) => {
    form.set(field.key, v === true);
    form.touch(field.key);
    form.check(field.key);
  },
});

export const radio = <T>(
  form: Service<T>,
  field: RadioField<T>,
  value: T[keyof T] | undefined,
): Controls["radio"] => ({
  modelValue: field.options.find((o) => o.value === value)?.value,
  options: field.options,
  disabled: field.disabled,
  required: field.required,
  orientation: field.orientation,
  "onUpdate:modelValue": (v) => {
    form.set(field.key, v);
    form.touch(field.key);
    form.check(field.key);
  },
});

export const date = <T>(
  form: Service<T>,
  field: DateField<T>,
  value: T[keyof T] | undefined,
): Controls["datePicker"] => ({
  modelValue: value instanceof Date ? deserialize(value) : undefined,
  disabled: field.disabled,
  "onUpdate:modelValue": (v) => {
    form.set(field.key, v ? serialize(v) : undefined);
    form.touch(field.key);
    form.check(field.key);
  },
});

export const tags = <T>(
  form: Service<T>,
  field: TagsInputField<T>,
  value: T[keyof T] | undefined,
): Controls["tagsInput"] => ({
  modelValue: Array.isArray(value) ? value : [],
  placeholder: field.placeholder,
  disabled: field.disabled,
  max: field.max,
  delimiter: field.delimiter,
  "onUpdate:modelValue": (v) => {
    form.set(field.key, v);
    form.touch(field.key);
    form.check(field.key);
  },
});

const blank = (): Controls => ({
  input: {},
  textarea: {},
  select: { options: [] },
  multiSelect: { items: [] },
  checkbox: {},
  radio: { options: [] },
  datePicker: { modelValue: undefined },
  tagsInput: {},
});

/**
 * Resolves a field to its control: seats the variant's recipe in an
 * otherwise-blank manifest so the field's single `usePassthrough` covers
 * every entry and `settings` stays the source of truth.
 */
export const resolve = <T>(
  form: Service<T>,
  field: Field<T>,
  value: T[keyof T] | undefined,
  error: string | undefined,
): ResolvedControl => {
  switch (field.type) {
    case "text":
    case "email":
    case "password":
      return {
        control: "input",
        recipes: { ...blank(), input: input(form, field, value, error) },
      };
    case "number":
      return {
        control: "input",
        recipes: { ...blank(), input: number(form, field, value, error) },
      };
    case "textarea":
      return {
        control: "textarea",
        recipes: { ...blank(), textarea: textarea(form, field, value, error) },
      };
    case "select":
      return {
        control: "select",
        recipes: { ...blank(), select: select(form, field, value) },
      };
    case "multi-select":
      return {
        control: "multiSelect",
        recipes: { ...blank(), multiSelect: multiselect(form, field, value) },
      };
    case "checkbox":
      return {
        control: "checkbox",
        recipes: { ...blank(), checkbox: checkbox(form, field, value) },
      };
    case "radio":
      return {
        control: "radio",
        recipes: { ...blank(), radio: radio(form, field, value) },
      };
    case "date":
      return {
        control: "datePicker",
        recipes: { ...blank(), datePicker: date(form, field, value) },
      };
    case "tags-input":
      return {
        control: "tagsInput",
        recipes: { ...blank(), tagsInput: tags(form, field, value) },
      };
  }
};
