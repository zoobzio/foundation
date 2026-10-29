import type { LinkProps, LinkTarget } from "../common";
import type { PassthroughIter, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { VNode } from "vue";

/**
 * A directory entry. An item with `link` renders as an anchor. An item without
 * `link` renders as a button and only emits `select`. Extra fields pass through
 * to the emit.
 */
export interface DirectoryItem {
  key: string;
  label: string;
  disabled?: boolean;
  link?: LinkTarget;
}

/**
 * A group of directory items with an optional label.
 */
export type DirectoryGroup<T extends DirectoryItem = DirectoryItem> = {
  key: string;
  label?: string;
  items: T[];
};

/**
 * The parts of the directory that accept passthrough. `link` is the
 * anchor of an item with `link`, built per item.
 */
export type DirectoryPassthrough<T extends DirectoryItem> = {
  link: PassthroughIter<T, LinkProps>;
};

/**
 * Props of the directory.
 */
export type DirectoryProps<T extends DirectoryItem> = {
  groups: DirectoryGroup<T>[];
  pt?: PT<DirectoryPassthrough<T>>;
};

/**
 * Emits of the directory.
 */
export type DirectoryEmits<T extends DirectoryItem> = {
  select: [item: T];
};

/**
 * The directory view model, served to `defineExpose` and the slots.
 */
export type DirectoryContext<T extends DirectoryItem> = {
  groups: DirectoryGroup<T>[];
  el: HTMLElement | null;
  settings: DirectoryPassthrough<T>;
};

/**
 * Slots of the directory. Item slots also receive the `item`.
 */
export type DirectorySlots<T extends DirectoryItem> = {
  groupLabel?: (
    props: DirectoryContext<T> & { group: DirectoryGroup<T> },
  ) => VNode[];
  item?: (props: DirectoryContext<T> & { item: T }) => VNode[];
  itemLabel?: (props: DirectoryContext<T> & { item: T }) => VNode[];
  itemPrepend?: (props: DirectoryContext<T> & { item: T }) => VNode[];
  itemAppend?: (props: DirectoryContext<T> & { item: T }) => VNode[];
};

/**
 * A directory instance as data: props plus emit listeners.
 */
export type DirectoryDefinition<T extends DirectoryItem> = Definition<
  DirectoryProps<T>,
  DirectoryEmits<T>
>;
