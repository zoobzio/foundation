export type CommandItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type CommandGroup = {
  key: string;
  label?: string;
  items: CommandItem[];
};

export type CommandProps = {
  groups: CommandGroup[];
  placeholder?: string;
  disabled?: boolean;
  tokens?: Tokens<
    | "command-root"
    | "command-input"
    | "command-content"
    | "command-viewport"
    | "command-group"
    | "command-label"
    | "command-item"
    | "command-empty"
  >;
};

export type CommandEmits = {
  select: [value: string];
};

export const defineCommand = useComponentRecipe<
  CommandProps,
  CommandEmits & FocusEvents
>();
