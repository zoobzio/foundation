import type { CaptionProps } from "#foundation/types/common/caption";
import type { GroupProps } from "#foundation/types/common/group";
import type { InputProps } from "#foundation/types/common/input";
import type { LabelProps } from "#foundation/types/common/label";
import type { TextareaProps } from "#foundation/types/common/textarea";
import type { CheckboxEmits, CheckboxProps } from "#foundation/types/core/checkbox";
import type { DatePickerEmits, DatePickerProps } from "#foundation/types/core/date-picker";
import type { MultiSelectEmits, MultiSelectProps } from "#foundation/types/core/multi-select";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { RadioEmits, RadioProps } from "#foundation/types/core/radio";
import type { SelectEmits, SelectProps } from "#foundation/types/core/select";
import type { TagsInputEmits, TagsInputProps } from "#foundation/types/core/tags-input";
import type { DataFormField, Form } from "#foundation/types/data/form";

export type DataFormFieldPassthrough = {
  root?: Passthrough<GroupProps>;
  label?: Passthrough<LabelProps>;
  error?: Passthrough<CaptionProps>;
  input?: Passthrough<InputProps>;
  textarea?: Passthrough<TextareaProps>;
  select?: Passthrough<SelectProps, SelectEmits>;
  multiSelect?: Passthrough<MultiSelectProps, MultiSelectEmits>;
  checkbox?: Passthrough<CheckboxProps, CheckboxEmits>;
  radio?: Passthrough<RadioProps, RadioEmits>;
  datePicker?: Passthrough<DatePickerProps, DatePickerEmits>;
  tagsInput?: Passthrough<TagsInputProps, TagsInputEmits>;
};

export interface DataFormFieldProps<T> {
  form: Form<T>;
  field: DataFormField<T>;
  pt?: DataFormFieldPassthrough;
}
