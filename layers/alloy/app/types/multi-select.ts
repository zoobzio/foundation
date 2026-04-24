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

export type MultiSelectEmits = {};

export const defineMultiSelect = defineComponentRecipe<MultiSelectProps, MultiSelectEmits>();

export type MultiSelectRecipe = Recipe<MultiSelectProps, MultiSelectEmits>;
