import type { ListboxRootProps, ListboxRootEmits, ListboxFilterProps, ListboxFilterEmits, ListboxContentProps, ListboxItemProps, ListboxItemEmits } from "reka-ui";

export type CommandItem = {
  value: string;
  label: string;
  icon?: IconAlias;
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
  inputWrapper?: Passthrough<GroupProps>;
  filter?: Passthrough<ListboxFilterProps, ListboxFilterEmits>;
  content?: Passthrough<ListboxContentProps>;
  viewport?: Passthrough<ScrollerProps>;
  empty?: Passthrough<GroupProps>;
  groupLabel?: Passthrough<CaptionProps>;
  item?: Passthrough<ListboxItemProps, ListboxItemEmits>;
  itemCheckbox?: Passthrough<CheckboxProps, CheckboxEmits>;
  itemIcon?: Passthrough<IconProps>;
  itemLabel?: Passthrough<SpanProps>;
  itemCount?: Passthrough<KbdProps>;
};

export type CommandProps = {
  groups: CommandGroup[];
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  filtered?: boolean;
  selected?: Set<string>;
  searchTerm?: string;
  pt?: CommandPassthrough;
};

export type CommandEmits = {
  select: [value: string];
  "update:selected": [value: Set<string>];
  "update:searchTerm": [value: string];
};

export type CommandRecipe = Recipe<CommandProps, CommandEmits>;
