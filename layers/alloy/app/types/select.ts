import type { SelectRootProps, SelectTriggerProps, SelectContentProps, SelectItemProps, SelectItemTextProps } from "reka-ui";

export type SelectPassthrough = {
  root?: Passthrough<SelectRootProps>;
  trigger?: Passthrough<SelectTriggerProps>;
  content?: Passthrough<SelectContentProps>;
  item?: Passthrough<SelectItemProps>;
  itemText?: Passthrough<SelectItemTextProps>;
};

export type SelectProps = {
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  pt?: SelectPassthrough;
};

export type SelectEmits = {} & MouseEvents & FocusEvents;

export const defineSelect = useComponentRecipe<SelectProps, SelectEmits>();

export type SelectRecipe = ComponentRecipe<SelectProps, SelectEmits>;
