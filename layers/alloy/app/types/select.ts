import type { SelectRootProps, SelectRootEmits, SelectTriggerProps, SelectContentProps, SelectContentEmits, SelectItemProps, SelectItemTextProps } from "reka-ui";

export type SelectPassthrough = {
  root?: Passthrough<SelectRootProps, SelectRootEmits>;
  trigger?: Passthrough<SelectTriggerProps>;
  content?: Passthrough<SelectContentProps, SelectContentEmits>;
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

export type SelectEmits = {};

export const defineSelect = defineComponentRecipe<SelectProps, SelectEmits>();

export type SelectRecipe = Recipe<SelectProps, SelectEmits>;
