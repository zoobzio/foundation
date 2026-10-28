import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { DatePickerEmits, DatePickerProps } from "./date-picker";
import type { FileInputEmits, FileInputProps } from "./file-input";
import type { MultiSelectEmits, MultiSelectProps } from "./multi-select";
import type { RadioEmits, RadioProps } from "./radio";
import type { RichTextEmits, RichTextProps } from "./rich-text";
import type { SelectEmits, SelectProps } from "./select";
import type { TagsInputEmits, TagsInputProps } from "./tags-input";
import type { Option } from "../common";
import type { Passthrough, PT } from "../passthrough";
import type { Field, Service } from "@zoobzio/form";
import type { InputHTMLAttributes, TextareaHTMLAttributes, VNode } from "vue";

/**
 * The parts of a form field that accept passthrough: one entry per control
 * the field can render. A field resolves to exactly one of them by its
 * config `type`; the rest stay blank.
 *
 * The `input` and `textarea` entries type against native HTML attributes
 * and bind directly to the rendered `<input>`/`<textarea>` tags, widened
 * with the field bindings the form drives (`value`, `min`, `max`, `step`).
 * `min` and `max` are numbers for a number field and strings for a native
 * date or time field.
 */
export type FormFieldPassthrough = {
  input: Passthrough<
    InputHTMLAttributes & {
      value?: string | number;
      min?: number | string;
      max?: number | string;
      step?: number;
    }
  >;
  textarea: Passthrough<TextareaHTMLAttributes & { value?: string }>;
  select: Passthrough<SelectProps<Option>, SelectEmits<Option>>;
  multiSelect: Passthrough<MultiSelectProps<Option>, MultiSelectEmits<Option>>;
  checkbox: Passthrough<CheckboxProps, CheckboxEmits>;
  radio: Passthrough<RadioProps, RadioEmits>;
  datePicker: Passthrough<DatePickerProps, DatePickerEmits>;
  tagsInput: Passthrough<TagsInputProps, TagsInputEmits>;
  fileInput: Passthrough<FileInputProps, FileInputEmits>;
  richText: Passthrough<RichTextProps, RichTextEmits>;
};

/**
 * The name of a control entry in the manifest.
 */
export type FormFieldControl = keyof FormFieldPassthrough;

/**
 * A field resolved to its control: `control` names the entry the template
 * renders, `recipes` is the full manifest with the active entry carrying
 * the field's wiring and the rest blank.
 */
export type FormFieldResolved = {
  control: FormFieldControl;
  recipes: FormFieldPassthrough;
};

/**
 * Props of a form field: the headless service, the field config it
 * renders, plus passthrough.
 */
export type FormFieldProps<T> = {
  service: Service<T>;
  field: Field<T>;
  pt?: PT<FormFieldPassthrough>;
};

/**
 * The form field view model, served to `defineExpose` and the slots.
 * `value`, `error`, and `touched` are the service's slice for the field:
 * `error` reports only once the field is touched.
 */
export type FormFieldContext<T> = {
  form: Service<T>;
  field: Field<T>;
  value: T[keyof T] | undefined;
  error: string | undefined;
  touched: boolean;
  control: FormFieldControl;
  el: HTMLDivElement | null;
  settings: FormFieldPassthrough;
};

/**
 * Slots of a form field. Each slot receives the context. One control slot
 * renders per field, chosen by the resolved `control`.
 */
export type FormFieldSlots<T> = {
  label?: (props: FormFieldContext<T>) => VNode[];
  input?: (props: FormFieldContext<T>) => VNode[];
  textarea?: (props: FormFieldContext<T>) => VNode[];
  select?: (props: FormFieldContext<T>) => VNode[];
  multiSelect?: (props: FormFieldContext<T>) => VNode[];
  checkbox?: (props: FormFieldContext<T>) => VNode[];
  radio?: (props: FormFieldContext<T>) => VNode[];
  datePicker?: (props: FormFieldContext<T>) => VNode[];
  tagsInput?: (props: FormFieldContext<T>) => VNode[];
  fileInput?: (props: FormFieldContext<T>) => VNode[];
  richText?: (props: FormFieldContext<T>) => VNode[];
  error?: (props: FormFieldContext<T>) => VNode[];
};
