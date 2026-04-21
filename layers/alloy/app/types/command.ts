import type { ListboxRootProps, ListboxFilterProps, ListboxContentProps, ListboxItemProps } from "reka-ui";

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
  root?: Passthrough<ListboxRootProps>;
  filter?: Passthrough<ListboxFilterProps>;
  content?: Passthrough<ListboxContentProps>;
  item?: Passthrough<ListboxItemProps>;
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

export const defineCommand = useComponentRecipe<CommandProps, CommandEmits>();

export type CommandRecipe = ComponentRecipe<CommandProps, CommandEmits>;
