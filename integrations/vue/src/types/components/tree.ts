import type { LinkProps, LinkTarget } from "../common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  FlattenedItem,
  TreeItemEmits,
  TreeItemProps,
  TreeRootEmits,
  TreeRootProps,
} from "reka-ui";

/**
 * A tree node. With `link`, the label renders as an anchor. Extra fields
 * on a consumer node come back in the emits. A type alias, not an
 * interface, to satisfy reka's `Record<string, any>` bound; it is the one
 * item type a framework layer cannot widen by declaration merging.
 *
 * For lazy loading, declare a branch with `children: []` and swap `items`
 * on `toggle`. reka emits `select` for branch clicks too. Enter on a link
 * node selects and does not navigate.
 */
export type TreeNode = {
  key: string;
  label: string;
  disabled?: boolean;
  link?: LinkTarget;
  children?: TreeNode[];
};

/**
 * The parts of the tree that accept passthrough. The root listener must
 * accept `T | T[]`: reka does not narrow the multiple generic through a
 * whole-object `v-bind`, so only `T` arrives at runtime. `link` is the
 * label anchor of a node with `link`, built per node.
 */
export type TreePassthrough<T extends TreeNode> = {
  root: Passthrough<TreeRootProps<T, T, false>, TreeRootEmits<T, boolean>>;
  item: PassthroughIter<FlattenedItem<T>, TreeItemProps<T>, TreeItemEmits<T>>;
  link: PassthroughIter<T, LinkProps>;
};

/**
 * Props of the tree. `modelValue` is the selected node object.
 * `expanded` holds the keys of open branches.
 */
export type TreeProps<T extends TreeNode> = {
  items: T[];
  modelValue?: NoInfer<T>;
  expanded?: string[];
  disabled?: boolean;
  pt?: PT<TreePassthrough<T>>;
};

/**
 * Emits of the tree. `toggle` carries the branch's new expanded state.
 */
export type TreeEmits<T extends TreeNode> = {
  "update:modelValue": [value: T | undefined];
  "update:expanded": [value: string[]];
  select: [node: T];
  toggle: [node: T, expanded: boolean];
};

/**
 * The tree view model, served to `defineExpose` and the slots.
 */
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

/**
 * Slots of the tree. Each slot receives the context, the flattened
 * `item`, and its expanded and selected state.
 */
export type TreeSlots<T extends TreeNode> = {
  item?: (props: TreeContext<T> & TreeItemScope<T>) => VNode[];
  itemToggle?: (props: TreeContext<T> & TreeItemScope<T>) => VNode[];
  itemLabel?: (props: TreeContext<T> & TreeItemScope<T>) => VNode[];
  itemPrepend?: (props: TreeContext<T> & TreeItemScope<T>) => VNode[];
  itemAppend?: (props: TreeContext<T> & TreeItemScope<T>) => VNode[];
};

/**
 * A tree instance as data: props plus emit listeners.
 */
export type TreeDefinition<T extends TreeNode> = Definition<
  TreeProps<T>,
  TreeEmits<T>
>;
