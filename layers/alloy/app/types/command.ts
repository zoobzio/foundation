import type { ListboxRootProps, ListboxRootEmits, ListboxFilterProps, ListboxFilterEmits, ListboxContentProps, ListboxItemProps, ListboxItemEmits } from "reka-ui";

export type CommandItem = {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
};

export type CommandGroup = {
  key: string;
  label?: string;
  items: CommandItem[];
};

export type CommandPassthrough = {
  root?: Passthrough<ListboxRootProps, ListboxRootEmits>;
  filter?: Passthrough<ListboxFilterProps, ListboxFilterEmits>;
  content?: Passthrough<ListboxContentProps>;
  item?: Passthrough<ListboxItemProps, ListboxItemEmits>;
};

export type CommandProps = {
  groups: CommandGroup[];
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  filtered?: boolean;
  pt?: CommandPassthrough;
};

export type CommandEmits = {
  select: [value: string];
};

export const defineCommand = defineComponentRecipe<CommandProps, CommandEmits>();

export type CommandRecipe = Recipe<CommandProps, CommandEmits>;
