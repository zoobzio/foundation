import type { ListboxRootProps, ListboxContentProps, ListboxItemProps } from "reka-ui";

export type ListboxPassthrough = {
  root?: Passthrough<ListboxRootProps>;
  content?: Passthrough<ListboxContentProps>;
  item?: Passthrough<ListboxItemProps>;
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
} & MouseEvents & FocusEvents;

export const defineListbox = useComponentRecipe<ListboxProps, ListboxEmits>();

export type ListboxRecipe = ComponentRecipe<ListboxProps, ListboxEmits>;
