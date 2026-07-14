import type { CaptionProps } from "#foundation/types/common/caption";
import type { GroupProps } from "#foundation/types/common/group";
import type { IconProps } from "#foundation/types/common/icon";
import type { IconAlias } from "#foundation/types/common/iconic";
import type { KbdProps } from "#foundation/types/common/kbd";
import type { SpanProps } from "#foundation/types/common/span";
import type { CheckboxEmits, CheckboxProps } from "#foundation/types/core/checkbox";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
import type { ScrollerProps } from "#foundation/types/core/scroller";
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
