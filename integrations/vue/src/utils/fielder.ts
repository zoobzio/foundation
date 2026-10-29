import type {
  FormFieldIds,
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
  Option,
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

/**
 * The attributes that tie a control to the text around it: the element id
 * the label's `for` targets, and the ids of the hint and the error while
 * each renders, as the control's description.
 */
type Wiring = {
  id: string;
  "aria-describedby": string | undefined;
};

/**
 * The element ids of a field's parts, from the form id and the field key.
 */
const ids = <T>(form: Service<T>, field: Field<T>): FormFieldIds => {
  const control = `${form.id}-${String(field.key)}`;
  return {
    control,
    label: `${control}-label`,
    hint: `${control}-hint`,
    error: `${control}-error`,
  };
};

const wiring = <T>(
  ids: FormFieldIds,
  field: Field<T>,
  error: string | undefined,
): Wiring => {
  const refs = [
    field.hint ? ids.hint : undefined,
    error ? ids.error : undefined,
  ].filter((ref) => ref !== undefined);
  return {
    id: ids.control,
    "aria-describedby": refs.length ? refs.join(" ") : undefined,
  };
};

const input = <T>(
  form: Service<T>,
  field: TextField<T>,
  value: T[keyof T] | undefined,
  error: string | undefined,
  wire: Wiring,
): FormFieldPassthrough["input"] => ({
  ...wire,
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
  wire: Wiring,
): FormFieldPassthrough["input"] => ({
  ...wire,
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
  wire: Wiring,
): FormFieldPassthrough["input"] => ({
  ...wire,
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
  wire: Wiring,
): FormFieldPassthrough["textarea"] => ({
  ...wire,
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

/**
 * Whether `value` is the value of one of `options`. The choice controls
 * type their options as `Option<string>`, so what they hand back is one of
 * `field.options` with its value widened; the guard restores the `V` the
 * field declared, and `set` checks the pair against the payload.
 */
const choice = <V extends string>(
  options: Option<V>[],
  value: string,
): value is V => options.some((o) => o.value === value);

/**
 * The choice controls are generic over the option value `V`, as the field
 * is.
 */
const select = <T, V extends string>(
  form: Service<T>,
  field: SelectField<T, V>,
  value: T[keyof T] | undefined,
  wire: Wiring,
): FormFieldPassthrough["select"] => ({
  modelValue: field.options.find((o) => o.value === value),
  options: field.options,
  placeholder: field.placeholder,
  disabled: field.disabled,
  required: field.required,
  pt: { trigger: wire },
  "onUpdate:modelValue": (option) => {
    if (choice(field.options, option.value)) form.set(field.key, option.value);
    form.touch(field.key);
    form.check(field.key);
  },
});

const multiselect = <T, V extends string>(
  form: Service<T>,
  field: MultiSelectField<T, V>,
  value: T[keyof T] | undefined,
  wire: Wiring,
): FormFieldPassthrough["multiSelect"] => ({
  modelValue: Array.isArray(value)
    ? field.options.filter((o) => value.includes(o.value))
    : [],
  items: field.options,
  placeholder: field.placeholder,
  disabled: field.disabled,
  required: field.required,
  pt: { trigger: wire },
  "onUpdate:modelValue": (options) => {
    form.set(
      field.key,
      (options ?? [])
        .map((o) => o.value)
        .filter((v): v is V => choice(field.options, v)),
    );
    form.touch(field.key);
    form.check(field.key);
  },
});

const checkbox = <T>(
  form: Service<T>,
  field: CheckboxField<T>,
  value: T[keyof T] | undefined,
  wire: Wiring,
): FormFieldPassthrough["checkbox"] => ({
  modelValue: !!value,
  disabled: field.disabled,
  required: field.required,
  pt: { root: wire },
  "onUpdate:modelValue": (v) => {
    form.set(field.key, v === true);
    form.touch(field.key);
    form.check(field.key);
  },
});

const radio = <T, V extends string>(
  form: Service<T>,
  field: RadioField<T, V>,
  value: T[keyof T] | undefined,
  wire: Wiring,
  ids: FormFieldIds,
): FormFieldPassthrough["radio"] => ({
  modelValue: field.options.find((o) => o.value === value)?.value,
  options: field.options,
  disabled: field.disabled,
  required: field.required,
  orientation: field.orientation,
  pt: { root: { ...wire, "aria-labelledby": ids.label } },
  "onUpdate:modelValue": (v) => {
    if (choice(field.options, v)) form.set(field.key, v);
    form.touch(field.key);
    form.check(field.key);
  },
});

/**
 * reka puts the root `id` on a hidden input that hands focus to the first
 * segment, so the label's `for` reaches the field; the group element
 * takes the aria wiring.
 */
const date = <T>(
  form: Service<T>,
  field: DateField<T>,
  value: T[keyof T] | undefined,
  wire: Wiring,
  ids: FormFieldIds,
): FormFieldPassthrough["datePicker"] => ({
  modelValue: value instanceof Date ? deserialize(value) : undefined,
  disabled: field.disabled,
  required: field.required,
  minValue: field.minDate ? deserialize(field.minDate) : undefined,
  maxValue: field.maxDate ? deserialize(field.maxDate) : undefined,
  pt: {
    root: { id: wire.id },
    field: {
      "aria-labelledby": ids.label,
      "aria-describedby": wire["aria-describedby"],
    },
  },
  "onUpdate:modelValue": (v) => {
    form.set(field.key, v ? serialize(v) : undefined);
    form.touch(field.key);
    form.check(field.key);
  },
});

/**
 * reka hands the root `id` to the text input, which takes the description.
 */
const tags = <T>(
  form: Service<T>,
  field: TagsInputField<T>,
  value: T[keyof T] | undefined,
  wire: Wiring,
): FormFieldPassthrough["tagsInput"] => ({
  modelValue: Array.isArray(value) ? value : [],
  placeholder: field.placeholder,
  disabled: field.disabled,
  required: field.required,
  max: field.max,
  delimiter: field.delimiter,
  pt: {
    root: { id: wire.id },
    input: { "aria-describedby": wire["aria-describedby"] },
  },
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
  wire: Wiring,
): FormFieldPassthrough["fileInput"] => ({
  modelValue: value instanceof File ? [value] : [],
  multiple: false,
  accept: field.accept,
  capture: field.capture,
  disabled: field.disabled,
  required: field.required,
  pt: { input: wire },
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
  wire: Wiring,
): FormFieldPassthrough["fileInput"] => ({
  modelValue: Array.isArray(value) ? value : [],
  multiple: true,
  accept: field.accept,
  capture: field.capture,
  disabled: field.disabled,
  required: field.required,
  pt: { input: wire },
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
 * The content host is a contenteditable, not a labelable element, so it
 * names its label through `aria-labelledby`.
 */
const richtext = <T>(
  form: Service<T>,
  field: RichTextField<T>,
  value: T[keyof T] | undefined,
  error: string | undefined,
  wire: Wiring,
  ids: FormFieldIds,
): FormFieldPassthrough["richText"] => ({
  modelValue: typeof value === "string" ? value : "",
  id: String(field.key),
  features: field.features,
  disabled: field.disabled,
  required: field.required,
  pt: {
    content: {
      ...wire,
      "aria-labelledby": ids.label,
      "aria-invalid": error ? true : undefined,
    },
  },
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
  const $ids = ids(form, field);
  const wire = wiring($ids, field, error);
  const resolve = (
    control: FormFieldResolved["control"],
    recipe: Partial<FormFieldPassthrough>,
  ): FormFieldResolved => ({
    control,
    recipes: { ...blank(), ...recipe },
    ids: $ids,
  });
  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "tel":
    case "url":
      return resolve("input", {
        input: input(form, field, value, error, wire),
      });
    case "number":
      return resolve("input", {
        input: number(form, field, value, error, wire),
      });
    case "time":
    case "datetime-local":
    case "date-input":
      return resolve("input", {
        input: temporal(form, field, value, error, wire),
      });
    case "textarea":
      return resolve("textarea", {
        textarea: textarea(form, field, value, error, wire),
      });
    case "select":
      return resolve("select", { select: select(form, field, value, wire) });
    case "multi-select":
      return resolve("multiSelect", {
        multiSelect: multiselect(form, field, value, wire),
      });
    case "checkbox":
      return resolve("checkbox", {
        checkbox: checkbox(form, field, value, wire),
      });
    case "radio":
      return resolve("radio", { radio: radio(form, field, value, wire, $ids) });
    case "date":
      return resolve("datePicker", {
        datePicker: date(form, field, value, wire, $ids),
      });
    case "tags-input":
      return resolve("tagsInput", {
        tagsInput: tags(form, field, value, wire),
      });
    case "file":
      return resolve("fileInput", {
        fileInput: file(form, field, value, wire),
      });
    case "multi-file":
      return resolve("fileInput", {
        fileInput: files(form, field, value, wire),
      });
    case "richtext":
      return resolve("richText", {
        richText: richtext(form, field, value, error, wire, $ids),
      });
  }
};
