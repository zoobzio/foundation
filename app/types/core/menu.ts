import type { CaptionProps } from "#foundation/types/common/caption";
import type {
  DropdownMenuRootProps,
  DropdownMenuRootEmits,
} from "#foundation/types/common/dropdown-menu/root";
import type { DropdownMenuTriggerProps } from "#foundation/types/common/dropdown-menu/trigger";
import type {
  DropdownMenuContentProps,
  DropdownMenuContentEmits,
} from "#foundation/types/common/dropdown-menu/content";
import type { DropdownMenuGroupProps } from "#foundation/types/common/dropdown-menu/group";
import type { DropdownMenuLabelProps } from "#foundation/types/common/dropdown-menu/label";
import type {
  DropdownMenuItemProps,
  DropdownMenuItemEmits,
} from "#foundation/types/common/dropdown-menu/item";
import type { DropdownMenuSeparatorProps } from "#foundation/types/common/dropdown-menu/separator";
import type { IconProps } from "#foundation/types/common/icon";
import type { IconAlias } from "#foundation/types/common/iconic";
import type { SpanProps } from "#foundation/types/common/span";
import type { ComponentEvents } from "#foundation/types/events";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "#foundation/types/passthrough";
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
  groupLabel: Passthrough<CaptionProps>;
  item: PassthroughIter<MenuItem, DropdownMenuItemProps, DropdownMenuItemEmits>;
  itemIcon: PassthroughIter<MenuItem, IconProps>;
  itemLabel: Passthrough<SpanProps>;
  separator: Passthrough<DropdownMenuSeparatorProps>;
};

export type MenuProps = {
  open?: boolean;
  groups: MenuGroup[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  pt?: PT<MenuPassthrough>;
};

export type MenuEmits = ComponentEvents["menu"] & {
  select: [item: MenuItem];
  "update:open": [value: boolean];
};

export type MenuContext = {
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
