import type { DataFormField, Form } from "./data-form";

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
