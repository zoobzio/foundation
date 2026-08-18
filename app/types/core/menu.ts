import type { ButtonEmits, ButtonProps } from "../common/button";
import type { CaptionProps } from "../common/caption";
import type {
  DropdownMenuRootProps,
  DropdownMenuRootEmits,
} from "../common/dropdown-menu/root";
import type { DropdownMenuTriggerProps } from "../common/dropdown-menu/trigger";
import type {
  DropdownMenuContentProps,
  DropdownMenuContentEmits,
} from "../common/dropdown-menu/content";
import type { DropdownMenuGroupProps } from "../common/dropdown-menu/group";
import type { DropdownMenuLabelProps } from "../common/dropdown-menu/label";
import type {
  DropdownMenuItemProps,
  DropdownMenuItemEmits,
} from "../common/dropdown-menu/item";
import type { DropdownMenuSeparatorProps } from "../common/dropdown-menu/separator";
import type { IconAlias, IconProps } from "../common/icon";
import type { SpanProps } from "../common/span";
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
  triggerButton: Passthrough<ButtonProps, ButtonEmits>;
  content: Passthrough<DropdownMenuContentProps, DropdownMenuContentEmits>;
  group: Passthrough<DropdownMenuGroupProps>;
  label: Passthrough<DropdownMenuLabelProps>;
  groupLabel: Passthrough<CaptionProps>;
  item: PassthroughIter<MenuItem, DropdownMenuItemProps, DropdownMenuItemEmits>;
  itemIcon: PassthroughIter<MenuItem, IconProps>;
  itemLabel: Passthrough<SpanProps>;
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
