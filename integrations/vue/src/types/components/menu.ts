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
import type { LinkProps, LinkTarget } from "../common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * A menu entry. With `link`, the item renders as an anchor and navigates
 * on activation. `select` still emits and the menu still closes. An
 * interface, so a framework layer may widen it by declaration merging.
 */
export interface MenuItem {
  label: string;
  disabled?: boolean;
  link?: LinkTarget;
}

/**
 * A labeled group of menu items.
 */
export type MenuGroup<T extends MenuItem = MenuItem> = {
  key: string;
  label?: string;
  items: T[];
};

/**
 * The parts of the menu that accept passthrough. `link` is the anchor a
 * linked item renders as child, built per item.
 */
export type MenuPassthrough<T extends MenuItem = MenuItem> = {
  root: Passthrough<DropdownMenuRootProps, DropdownMenuRootEmits>;
  trigger: Passthrough<DropdownMenuTriggerProps>;
  content: Passthrough<DropdownMenuContentProps, DropdownMenuContentEmits>;
  group: Passthrough<DropdownMenuGroupProps>;
  label: Passthrough<DropdownMenuLabelProps>;
  item: PassthroughIter<T, DropdownMenuItemProps, DropdownMenuItemEmits>;
  link: PassthroughIter<T, LinkProps>;
  separator: Passthrough<DropdownMenuSeparatorProps>;
};

/**
 * Props of the menu.
 */
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

/**
 * Emits of the menu.
 */
export type MenuEmits<T extends MenuItem = MenuItem> = {
  select: [item: T];
  "update:open": [value: boolean];
};

/**
 * The menu view model, served to `defineExpose` and the slots.
 */
export type MenuContext<T extends MenuItem = MenuItem> = {
  label?: string;
  groups: MenuGroup<T>[];
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  alignOffset: number;
  open: Ref<boolean>;
  el: ComponentPublicInstance | null;
  settings: MenuPassthrough<T>;
};

/**
 * Slots of the menu. Each slot receives the context.
 * Group and item slots also receive the `group` or `item`.
 */
export type MenuSlots<T extends MenuItem = MenuItem> = {
  default?: (props: MenuContext<T>) => VNode[];
  trigger?: (props: MenuContext<T>) => VNode[];
  content?: (props: MenuContext<T>) => VNode[];
  groupLabel?: (props: MenuContext<T> & { group: MenuGroup<T> }) => VNode[];
  item?: (props: MenuContext<T> & { item: T }) => VNode[];
  itemLabel?: (props: MenuContext<T> & { item: T }) => VNode[];
  itemPrepend?: (props: MenuContext<T> & { item: T }) => VNode[];
  itemAppend?: (props: MenuContext<T> & { item: T }) => VNode[];
};

/**
 * A menu instance as data: props plus emit listeners.
 */
export type MenuDefinition<T extends MenuItem> = Definition<
  MenuProps<T>,
  MenuEmits<T>
>;
