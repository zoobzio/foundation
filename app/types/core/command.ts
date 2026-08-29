import type {
  CheckboxEmits,
  CheckboxProps,
} from "./checkbox";
import type { ScrollerProps } from "./scroller";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type { Option } from "./common";
import type {
  ListboxRootProps,
  ListboxRootEmits,
  ListboxFilterProps,
  ListboxFilterEmits,
  ListboxContentProps,
  ListboxGroupProps,
  ListboxGroupLabelProps,
  ListboxItemProps,
  ListboxItemEmits,
} from "reka-ui";

export type CommandOption = Option & {
  count?: number;
};

export type CommandGroup<T extends CommandOption> = {
  key: string;
  label: string;
  options: T[];
};

export type CommandPassthrough<T extends CommandOption = CommandOption> = {
  root: Passthrough<ListboxRootProps, ListboxRootEmits>;
  filter: Passthrough<ListboxFilterProps, ListboxFilterEmits>;
  content: Passthrough<ListboxContentProps>;
  viewport: Passthrough<ScrollerProps>;
  group: Passthrough<ListboxGroupProps>;
  groupLabel: Passthrough<ListboxGroupLabelProps>;
  item: PassthroughIter<T, ListboxItemProps, ListboxItemEmits>;
  itemCheckbox: PassthroughIter<T, CheckboxProps, CheckboxEmits>;
};

export type CommandProps<T extends CommandOption> = {
  groups: CommandGroup<T>[];
  modelValue?: NoInfer<T[] | undefined>;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  search?: string;
  pt?: PT<CommandPassthrough<T>>;
};

export type CommandEmits<T extends CommandOption> =
  {
    "update:modelValue": [value: T[] | undefined];
    "update:search": [value: string];
  };

export type CommandContext<T extends CommandOption> = {
  groups: CommandGroup<T>[];
  placeholder: string;
  disabled?: boolean;
  multiple: boolean;
  search: Ref<string | undefined>;
  modelValue: Ref<T[] | undefined>;
  results: CommandGroup<T>[];
  el: ComponentPublicInstance | null;
  settings: CommandPassthrough<T>;
};

export type OptionContext<T extends CommandOption> = CommandContext<T> & {
  item: T;
  selected: boolean;
};

export type CommandSlots<T extends CommandOption> = {
  inputWrapper?: (props: CommandContext<T>) => VNode[];
  inputIcon?: (props: CommandContext<T>) => VNode[];
  filter?: (props: CommandContext<T>) => VNode[];
  content?: (props: CommandContext<T>) => VNode[];
  viewport?: (props: CommandContext<T>) => VNode[];
  empty?: (props: CommandContext<T>) => VNode[];
  groupLabel?: (
    props: CommandContext<T> & { group: CommandGroup<T> },
  ) => VNode[];
  item?: (props: OptionContext<T>) => VNode[];
  itemCheckbox?: (props: OptionContext<T>) => VNode[];
  itemIcon?: (props: CommandContext<T> & { item: T }) => VNode[];
  itemLabel?: (props: CommandContext<T> & { item: T }) => VNode[];
  itemCount?: (props: CommandContext<T> & { item: T }) => VNode[];
};
