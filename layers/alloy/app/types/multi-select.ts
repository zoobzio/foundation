export type MultiSelectPassthrough = {
  trigger?: Passthrough<ButtonProps>;
  content?: Passthrough<GroupProps>;
  item?: Passthrough<ButtonProps>;
};

export type MultiSelectProps = {
  items: Option[];
  placeholder?: string;
  disabled?: boolean;
  pt?: MultiSelectPassthrough;
};

export type MultiSelectEmits = {} & MouseEvents & FocusEvents;

export const defineMultiSelect = useComponentRecipe<MultiSelectProps, MultiSelectEmits>();

export type MultiSelectRecipe = ComponentRecipe<MultiSelectProps, MultiSelectEmits>;
