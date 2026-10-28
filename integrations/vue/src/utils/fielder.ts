import type {
  FormFieldPassthrough,
  FormFieldResolved,
} from "../types/components/form-field";
import type {
  Field,
  CheckboxField,
  DateField,
  FileField,
  MultiFileField,
  MultiSelectField,
  NumberField,
  RadioField,
  RichTextField,
  SelectField,
  Service,
  TagsInputField,
  TemporalField,
  TextField,
  TextareaField,
} from "@zoobzio/form";

import { FORM_TEMPORAL_TYPES } from "../constants/form";
import { deserialize, serialize } from "./date";

const input = <T>(
  form: Service<T>,
  field: TextField<T>,
  value: T[keyof T] | undefined,
  error: string | undefined,
): FormFieldPassthrough["input"] => ({
  value: typeof value === "string" ? value : undefined,
  type: field.type,
  placeholder: field.placeholder,
  disabled: field.disabled,
  required: field.required,
  maxlength: field.maxLength,
  "aria-invalid": error ? true : undefined,
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

const number = <T>(
  form: Service<T>,
  field: NumberField<T>,
  value: T[keyof T] | undefined,
  error: string | undefined,
): FormFieldPassthrough["input"] => ({
  value: typeof value === "number" ? value : undefined,
  type: "number",
  placeholder: field.placeholder,
  disabled: field.disabled,
  required: field.required,
  min: field.min,
  max: field.max,
  step: field.step,
  "aria-invalid": error ? true : undefined,
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

const temporal = <T>(
  form: Service<T>,
  field: TemporalField<T>,
  value: T[keyof T] | undefined,
  error: string | undefined,
): FormFieldPassthrough["input"] => ({
  value: typeof value === "string" ? value : undefined,
  type: FORM_TEMPORAL_TYPES[field.type],
  disabled: field.disabled,
  required: field.required,
  min: field.min,
  max: field.max,
  step: field.step,
  "aria-invalid": error ? true : undefined,
  onInput: (event) => {
    if (event.target instanceof HTMLInputElement) {
      const { value } = event.target;
      form.set(field.key, value === "" ? undefined : value);
    }
  },
  onBlur: () => {
    form.touch(field.key);
    form.check(field.key);
  },
});

const textarea = <T>(
  form: Service<T>,
  field: TextareaField<T>,
  value: T[keyof T] | undefined,
  error: string | undefined,
): FormFieldPassthrough["textarea"] => ({
  value: typeof value === "string" ? value : undefined,
  placeholder: field.placeholder,
  disabled: field.disabled,
  required: field.required,
  rows: field.rows,
  maxlength: field.maxLength,
  "aria-invalid": error ? true : undefined,
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

const select = <T>(
  form: Service<T>,
  field: SelectField<T>,
  value: T[keyof T] | undefined,
): FormFieldPassthrough["select"] => ({
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

const multiselect = <T>(
  form: Service<T>,
  field: MultiSelectField<T>,
  value: T[keyof T] | undefined,
): FormFieldPassthrough["multiSelect"] => ({
  modelValue: Array.isArray(value)
    ? field.options.filter((o) => value.includes(o.value))
    : [],
  items: field.options,
  placeholder: field.placeholder,
  disabled: field.disabled,
  required: field.required,
  "onUpdate:modelValue": (options) => {
    form.set(
      field.key,
      (options ?? []).map((o) => o.value),
    );
    form.touch(field.key);
    form.check(field.key);
  },
});

const checkbox = <T>(
  form: Service<T>,
  field: CheckboxField<T>,
  value: T[keyof T] | undefined,
): FormFieldPassthrough["checkbox"] => ({
  modelValue: !!value,
  disabled: field.disabled,
  required: field.required,
  "onUpdate:modelValue": (v) => {
    form.set(field.key, v === true);
    form.touch(field.key);
    form.check(field.key);
  },
});

const radio = <T>(
  form: Service<T>,
  field: RadioField<T>,
  value: T[keyof T] | undefined,
): FormFieldPassthrough["radio"] => ({
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

const date = <T>(
  form: Service<T>,
  field: DateField<T>,
  value: T[keyof T] | undefined,
): FormFieldPassthrough["datePicker"] => ({
  modelValue: value instanceof Date ? deserialize(value) : undefined,
  disabled: field.disabled,
  required: field.required,
  minValue: field.minDate ? deserialize(field.minDate) : undefined,
  maxValue: field.maxDate ? deserialize(field.maxDate) : undefined,
  "onUpdate:modelValue": (v) => {
    form.set(field.key, v ? serialize(v) : undefined);
    form.touch(field.key);
    form.check(field.key);
  },
});

const tags = <T>(
  form: Service<T>,
  field: TagsInputField<T>,
  value: T[keyof T] | undefined,
): FormFieldPassthrough["tagsInput"] => ({
  modelValue: Array.isArray(value) ? value : [],
  placeholder: field.placeholder,
  disabled: field.disabled,
  required: field.required,
  max: field.max,
  delimiter: field.delimiter,
  "onUpdate:modelValue": (v) => {
    form.set(field.key, v);
    form.touch(field.key);
    form.check(field.key);
  },
});

const file = <T>(
  form: Service<T>,
  field: FileField<T>,
  value: T[keyof T] | undefined,
): FormFieldPassthrough["fileInput"] => ({
  modelValue: value instanceof File ? [value] : [],
  multiple: false,
  accept: field.accept,
  capture: field.capture,
  disabled: field.disabled,
  required: field.required,
  "onUpdate:modelValue": (files) => {
    form.set(field.key, files[0]);
    form.touch(field.key);
    form.check(field.key);
  },
});

const files = <T>(
  form: Service<T>,
  field: MultiFileField<T>,
  value: T[keyof T] | undefined,
): FormFieldPassthrough["fileInput"] => ({
  modelValue: Array.isArray(value) ? value : [],
  multiple: true,
  accept: field.accept,
  capture: field.capture,
  disabled: field.disabled,
  required: field.required,
  "onUpdate:modelValue": (v) => {
    form.set(field.key, v);
    form.touch(field.key);
    form.check(field.key);
  },
});

/**
 * The rich text writes on every edit and validates on blur, as a textarea
 * does. The field's features are the editor's config: the two are
 * structurally one type, and this assignment is where that is checked.
 */
const richtext = <T>(
  form: Service<T>,
  field: RichTextField<T>,
  value: T[keyof T] | undefined,
  error: string | undefined,
): FormFieldPassthrough["richText"] => ({
  modelValue: typeof value === "string" ? value : "",
  id: String(field.key),
  features: field.features,
  disabled: field.disabled,
  required: field.required,
  pt: { content: { "aria-invalid": error ? true : undefined } },
  "onUpdate:modelValue": (v) => {
    form.set(field.key, v);
  },
  onBlur: () => {
    form.touch(field.key);
    form.check(field.key);
  },
});

const blank = (): FormFieldPassthrough => ({
  input: {},
  textarea: {},
  select: { options: [] },
  multiSelect: { items: [] },
  checkbox: {},
  radio: { options: [] },
  datePicker: { modelValue: undefined },
  tagsInput: {},
  fileInput: {},
  richText: {},
});

export const fielder = <T>(
  form: Service<T>,
  field: Field<T>,
): FormFieldResolved => {
  const { value, error } = form.field(field.key);
  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "tel":
    case "url":
      return {
        control: "input",
        recipes: { ...blank(), input: input(form, field, value, error) },
      };
    case "number":
      return {
        control: "input",
        recipes: { ...blank(), input: number(form, field, value, error) },
      };
    case "time":
    case "datetime-local":
    case "date-input":
      return {
        control: "input",
        recipes: { ...blank(), input: temporal(form, field, value, error) },
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
    case "file":
      return {
        control: "fileInput",
        recipes: { ...blank(), fileInput: file(form, field, value) },
      };
    case "multi-file":
      return {
        control: "fileInput",
        recipes: { ...blank(), fileInput: files(form, field, value) },
      };
    case "richtext":
      return {
        control: "richText",
        recipes: { ...blank(), richText: richtext(form, field, value, error) },
      };
  }
};
