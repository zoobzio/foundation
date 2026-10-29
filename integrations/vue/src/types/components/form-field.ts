import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { DatePickerEmits, DatePickerProps } from "./date-picker";
import type { FileInputEmits, FileInputProps } from "./file-input";
import type { MultiSelectEmits, MultiSelectProps } from "./multi-select";
import type { RadioEmits, RadioProps } from "./radio";
import type { RichTextEmits, RichTextProps } from "./rich-text";
import type { SelectEmits, SelectProps } from "./select";
import type { TagsInputEmits, TagsInputProps } from "./tags-input";
import type { Option } from "../common";
import type { PT, Passthrough, Rendered } from "../passthrough";
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
  select: Rendered<SelectProps<Option>, SelectEmits<Option>>;
  multiSelect: Rendered<MultiSelectProps<Option>, MultiSelectEmits<Option>>;
  checkbox: Rendered<CheckboxProps, CheckboxEmits>;
  radio: Rendered<RadioProps, RadioEmits>;
  datePicker: Rendered<DatePickerProps, DatePickerEmits>;
  tagsInput: Rendered<TagsInputProps, TagsInputEmits>;
  fileInput: Rendered<FileInputProps, FileInputEmits>;
  richText: Rendered<RichTextProps, RichTextEmits>;
};

/**
 * The manifest as the fielder builds it: every part's wiring, without the
 * component each control part renders, which the component adds.
 */
export type FormFieldRecipes = {
  [K in keyof FormFieldPassthrough]: Omit<FormFieldPassthrough[K], "as">;
};

/**
 * The name of a control entry in the manifest.
 */
export type FormFieldControl = keyof FormFieldPassthrough;

/**
 * The element ids of a field's parts, derived from the form id and the
 * field key, so they are stable across renders and the server. The label
 * targets `control` through `for`; a grouped control (radio, date picker,
 * rich text) points back at `label` through `aria-labelledby`; the control
 * lists `hint` and `error` in `aria-describedby` while each renders.
 */
export type FormFieldIds = {
  control: string;
  label: string;
  hint: string;
  error: string;
};

/**
 * A field resolved to its control: `control` names the entry the template
 * renders, `recipes` is the full manifest with the active entry carrying
 * the field's wiring and the rest blank, and `ids` are the element ids the
 * wiring refers to.
 */
export type FormFieldResolved = {
  control: FormFieldControl;
  recipes: FormFieldRecipes;
  ids: FormFieldIds;
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
 * `error` reports only once the field is touched. `ids` are the element
 * ids the control's wiring refers to, so a slot override keeps the
 * label, hint, and error associated with the control.
 */
export type FormFieldContext<T> = {
  form: Service<T>;
  field: Field<T>;
  value: T[keyof T] | undefined;
  error: string | undefined;
  touched: boolean;
  control: FormFieldControl;
  ids: FormFieldIds;
  el: HTMLDivElement | null;
  settings: FormFieldPassthrough;
};

/**
 * Slots of a form field. Each slot receives the context. One control slot
 * renders per field, chosen by the resolved `control`. `hint` renders when
 * the field config sets one; `error` once the field is touched and invalid.
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
  hint?: (props: FormFieldContext<T>) => VNode[];
  error?: (props: FormFieldContext<T>) => VNode[];
};
