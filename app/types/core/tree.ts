import type { IconAlias } from "../icon";
import type { Link } from "./common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  FlattenedItem,
  TreeItemEmits,
  TreeItemProps,
  TreeRootEmits,
  TreeRootProps,
} from "reka-ui";

/**
 * A tree node: a labeled item that may nest children. `link` makes it a
 * real hyperlink rendered through NuxtLink — native navigation semantics
 * intact; without it the label is plain text and only the emits fire.
 * Consumers extend the node with their own fields and receive them back in
 * the emits; a consumer type that redeclares `children` with its own node
 * type keeps the whole tree self-typed. Declared as a type alias (not an
 * interface) so it satisfies reka's `Record<string, any>` bound.
 *
 * Lazy loading rides the emit surface: declare a not-yet-loaded branch with
 * `children: []` (it renders expandable), then load and swap `items` on
 * `toggle`. Note reka fires `select` for branch clicks too, and keyboard
 * Enter on a link node triggers selection, not link navigation.
 */
export type TreeNode = {
  key: string;
  label: string;
  icon?: IconAlias;
  disabled?: boolean;
  link?: Pick<Link, "to" | "external" | "target" | "replace" | "prefetch">;
  children?: TreeNode[];
};

/**
 * The root's emits are typed with `M` left wide: reka's SFC types don't
 * narrow the multiple generic through a whole-object `v-bind`, so the
 * bound listener must accept the `T | T[]` union even though
 * `multiple: false` means only `T` ever arrives.
 */
export type TreePassthrough<T extends TreeNode> = {
  root: Passthrough<TreeRootProps<T, T, false>, TreeRootEmits<T, boolean>>;
  item: PassthroughIter<FlattenedItem<T>, TreeItemProps<T>, TreeItemEmits<T>>;
};

export type TreeProps<T extends TreeNode> = {
  items: T[];
  modelValue?: NoInfer<T>;
  expanded?: string[];
  disabled?: boolean;
  pt?: PT<TreePassthrough<T>>;
};

export type TreeEmits<T extends TreeNode> = {
  "update:modelValue": [value: T | undefined];
  "update:expanded": [value: string[]];
  select: [node: T];
  toggle: [node: T, expanded: boolean];
};

export type TreeContext<T extends TreeNode> = {
  items: T[];
  disabled?: boolean;
  modelValue: Ref<T | undefined>;
  expanded: Ref<string[] | undefined>;
  el: ComponentPublicInstance | null;
  settings: TreePassthrough<T>;
};

type TreeItemScope<T extends TreeNode> = {
  item: FlattenedItem<T>;
  isExpanded: boolean;
  isSelected: boolean;
};

export type TreeSlots<T extends TreeNode> = {
  item?: (props: TreeContext<T> & TreeItemScope<T>) => VNode[];
  itemToggle?: (props: TreeContext<T> & TreeItemScope<T>) => VNode[];
  itemIcon?: (props: TreeContext<T> & TreeItemScope<T>) => VNode[];
  itemLabel?: (props: TreeContext<T> & TreeItemScope<T>) => VNode[];
};
