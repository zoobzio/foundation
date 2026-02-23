export type MultiSelectProps = {
  items: Option[];
  placeholder?: string;
  disabled?: boolean;
};

export type MultiSelectEmits = {
  "update:modelValue": [string[]];
};

export const defineMultiSelect = useComponentRecipe<
  MultiSelectProps,
  MultiSelectEmits & FocusEvents
>();
