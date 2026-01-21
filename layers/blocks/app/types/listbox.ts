import type { listbox } from "../../elements.config";

export type ListboxProps = {
  items: Option[];
  modelValue?: string | string[];
  multiple?: boolean;
  disabled?: boolean;
  tokens?: Tokens<typeof listbox.root | typeof listbox.content | typeof listbox.item>;
};

export type ListboxEmits = {
  "update:modelValue": [string | string[]];
};

export const defineListbox = useComponentRecipe<
  ListboxProps,
  ListboxEmits & FocusEvents
>();
