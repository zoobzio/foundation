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
import type { LinkTarget } from "./common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * A menu entry. `link` makes it a real hyperlink rendered through NuxtLink —
 * the item renders as the anchor itself, so pointer and keyboard activation
 * both navigate natively; `select` still fires and the menu still closes.
 * Without it the item is a plain action and only the emit fires.
 */
export type MenuItem = {
  label: string;
  disabled?: boolean;
  link?: LinkTarget;
};

export type MenuGroup<T extends MenuItem = MenuItem> = {
  key: string;
  label?: string;
  items: T[];
};

export type MenuPassthrough<T extends MenuItem = MenuItem> = {
  root: Passthrough<DropdownMenuRootProps, DropdownMenuRootEmits>;
  trigger: Passthrough<DropdownMenuTriggerProps>;
  content: Passthrough<DropdownMenuContentProps, DropdownMenuContentEmits>;
  group: Passthrough<DropdownMenuGroupProps>;
  label: Passthrough<DropdownMenuLabelProps>;
  item: PassthroughIter<T, DropdownMenuItemProps, DropdownMenuItemEmits>;
  separator: Passthrough<DropdownMenuSeparatorProps>;
};

export type MenuProps<T extends MenuItem = MenuItem> = {
  open?: boolean;
  label?: string;
  groups: MenuGroup<T>[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  pt?: PT<MenuPassthrough<T>>;
};

export type MenuEmits<T extends MenuItem = MenuItem> = {
  select: [item: T];
  "update:open": [value: boolean];
};

export type MenuContext<T extends MenuItem = MenuItem> = {
  label?: string;
  groups: MenuGroup<T>[];
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  alignOffset: number;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: MenuPassthrough<T>;
};

export type MenuSlots<T extends MenuItem = MenuItem> = {
  default?: (props: MenuContext<T>) => VNode[];
  trigger?: (props: MenuContext<T>) => VNode[];
  content?: (props: MenuContext<T>) => VNode[];
  groupLabel?: (props: MenuContext<T> & { group: MenuGroup<T> }) => VNode[];
  item?: (props: MenuContext<T> & { item: T }) => VNode[];
  itemIcon?: (props: MenuContext<T> & { item: T }) => VNode[];
  itemLabel?: (props: MenuContext<T> & { item: T }) => VNode[];
};
