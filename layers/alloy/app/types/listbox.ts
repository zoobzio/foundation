import type { ListboxRootProps, ListboxRootEmits, ListboxContentProps, ListboxItemProps, ListboxItemEmits } from "reka-ui";

export type ListboxPassthrough = {
  root?: Passthrough<ListboxRootProps, ListboxRootEmits>;
  content?: Passthrough<ListboxContentProps>;
  item?: Passthrough<ListboxItemProps, ListboxItemEmits>;
};

export type ListboxProps = {
  items: Option[];
  modelValue?: string | string[];
  multiple?: boolean;
  disabled?: boolean;
  pt?: ListboxPassthrough;
};

export type ListboxEmits = {
  "update:modelValue": [string | string[]];
};

export const defineListbox = defineComponentRecipe<ListboxProps, ListboxEmits>();

export type ListboxRecipe = Recipe<ListboxProps, ListboxEmits>;
