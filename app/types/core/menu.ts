import type {
  DropdownMenuRootProps,
  DropdownMenuRootEmits,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuContentEmits,
  DropdownMenuGroupProps,
  DropdownMenuLabelProps,
  DropdownMenuItemProps,
  DropdownMenuItemEmits,
  DropdownMenuSeparatorProps,
} from "reka-ui";
import type { IconAlias } from "../icon";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type MenuItem = {
  icon?: IconAlias;
  label: string;
  disabled?: boolean;
};

export type MenuGroup = {
  key: string;
  label?: string;
  items: MenuItem[];
};

export type MenuPassthrough = {
  root: Passthrough<DropdownMenuRootProps, DropdownMenuRootEmits>;
  trigger: Passthrough<DropdownMenuTriggerProps>;
  content: Passthrough<DropdownMenuContentProps, DropdownMenuContentEmits>;
  group: Passthrough<DropdownMenuGroupProps>;
  label: Passthrough<DropdownMenuLabelProps>;
  item: PassthroughIter<MenuItem, DropdownMenuItemProps, DropdownMenuItemEmits>;
  separator: Passthrough<DropdownMenuSeparatorProps>;
};

export type MenuProps = {
  open?: boolean;
  label?: string;
  groups: MenuGroup[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  pt?: PT<MenuPassthrough>;
};

export type MenuEmits = {
  select: [item: MenuItem];
  "update:open": [value: boolean];
};

export type MenuContext = {
  label?: string;
  groups: MenuGroup[];
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  alignOffset: number;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: MenuPassthrough;
};

export type MenuSlots = {
  default?: (props: MenuContext) => VNode[];
  trigger?: (props: MenuContext) => VNode[];
  content?: (props: MenuContext) => VNode[];
  groupLabel?: (props: MenuContext & { group: MenuGroup }) => VNode[];
  item?: (props: MenuContext & { item: MenuItem }) => VNode[];
  itemIcon?: (props: MenuContext & { item: MenuItem }) => VNode[];
  itemLabel?: (props: MenuContext & { item: MenuItem }) => VNode[];
};
