export type MultiSelectPassthrough = {
  popover?: Passthrough<PopoverProps, PopoverEmits>;
  trigger?: Passthrough<ButtonProps>;
  triggerLabel?: Passthrough<SpanProps>;
  triggerIcon?: Passthrough<IconProps>;
  content?: Passthrough<GroupProps>;
  item?: Passthrough<ButtonProps>;
  itemCheckbox?: Passthrough<CheckboxProps, CheckboxEmits>;
  itemLabel?: Passthrough<SpanProps>;
};

export type MultiSelectProps = {
  modelValue?: string[];
  items: Option[];
  placeholder?: string;
  disabled?: boolean;
  pt?: MultiSelectPassthrough;
};

export type MultiSelectEmits = {
  "update:modelValue": [value: string[]];
};

export type MultiSelectRecipe = Recipe<MultiSelectProps, MultiSelectEmits>;
