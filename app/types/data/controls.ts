import type {
  CheckboxProps,
  CheckboxEmits,
} from "../core/checkbox";
import type {
  DatePickerProps,
  DatePickerEmits,
} from "../core/date-picker";
import type {
  MultiSelectProps,
  MultiSelectEmits,
} from "../core/multi-select";
import type { RadioProps, RadioEmits } from "../core/radio";
import type { SelectProps, SelectEmits } from "../core/select";
import type {
  TagsInputProps,
  TagsInputEmits,
} from "../core/tags-input";
import type { Option } from "../core/common";
import type { Passthrough } from "../passthrough";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "vue";

/**
 * One passthrough entry per control the form widget can render.
 *
 * The `input` and `textarea` entries type against native HTML attributes and
 * bind directly to the rendered `<input>`/`<textarea>` tags, widened with the
 * field bindings the form drives (`value`, `min`, `max`, `step`).
 */
export type Controls = {
  input: Passthrough<
    InputHTMLAttributes & {
      value?: string | number;
      min?: number;
      max?: number;
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
};

/**
 * The name of a control entry in the manifest.
 */
export type Control = keyof Controls;

/**
 * A field resolved to its control: `control` names the entry the template
 * renders, `recipes` is the full control manifest — the active entry carries
 * the field's mapping, the rest are blank.
 */
export type ResolvedControl = {
  control: Control;
  recipes: Controls;
};
