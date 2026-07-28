import type { CaptionProps } from "#foundation/types/common/caption";
import type { GroupProps } from "#foundation/types/common/group";
import type { LabelProps } from "#foundation/types/common/label";
import type { TextareaProps } from "#foundation/types/common/textarea";
import type {
  CheckboxEmits,
  CheckboxProps,
} from "#foundation/types/core/checkbox";
import type {
  DatePickerEmits,
  DatePickerProps,
} from "#foundation/types/core/date-picker";
import type {
  MultiSelectEmits,
  MultiSelectProps,
} from "#foundation/types/core/multi-select";
import type { RadioEmits, RadioProps } from "#foundation/types/core/radio";
import type { SelectEmits, SelectProps } from "#foundation/types/core/select";
import type {
  TagsInputEmits,
  TagsInputProps,
} from "#foundation/types/core/tags-input";
import type { FormInputProps } from "#foundation/types/data/form/fields/input";
import type { Option } from "#foundation/types/core/common";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { DataFormField, Form } from "#foundation/types/data/form";

export type DataFormFieldPassthrough<T> = {
  root: Passthrough<GroupProps>;
  label: Passthrough<LabelProps>;
  error: Passthrough<CaptionProps>;
  input: Passthrough<FormInputProps<T>>;
  textarea: Passthrough<TextareaProps>;
  select: Passthrough<SelectProps<Option>, SelectEmits<Option>>;
  multiSelect: Passthrough<MultiSelectProps<Option>, MultiSelectEmits<Option>>;
  checkbox: Passthrough<CheckboxProps, CheckboxEmits>;
  radio: Passthrough<RadioProps, RadioEmits>;
  datePicker: Passthrough<DatePickerProps, DatePickerEmits>;
  tagsInput: Passthrough<TagsInputProps, TagsInputEmits>;
};

export interface DataFormFieldProps<T> {
  form: Form<T>;
  field: DataFormField<T>;
  pt?: PT<DataFormFieldPassthrough<T>>;
}
