import type { command } from "../../elements.config";

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
    | typeof command.root
    | typeof command.input
    | typeof command.content
    | typeof command.viewport
    | typeof command.group
    | typeof command.label
    | typeof command.item
    | typeof command.empty
  >;
};

export type CommandEmits = {
  select: [value: string];
};

export const defineCommand = useComponentRecipe<
  CommandProps,
  CommandEmits & FocusEvents
>();
