import type { IconAlias } from "../icon";
import type { Link } from "./common";
import type { VNode } from "vue";

/**
 * A directory entry: a labeled item that activates on click. `link` makes it
 * a real hyperlink rendered through Anchor — native navigation semantics
 * intact; without it the item renders as a Button and only the `select` emit
 * fires. Consumers extend the item with their own fields and receive them
 * back in the emit.
 */
export type DirectoryItem = {
  key: string;
  label: string;
  icon?: IconAlias;
  disabled?: boolean;
  link?: Pick<Link, "to" | "external" | "target" | "replace" | "prefetch">;
};

export type DirectoryGroup<T extends DirectoryItem = DirectoryItem> = {
  key: string;
  label?: string;
  items: T[];
};

export type DirectoryProps<T extends DirectoryItem> = {
  groups: DirectoryGroup<T>[];
};

export type DirectoryEmits<T extends DirectoryItem> =
  {
    select: [item: T];
  };

export type DirectoryContext<T extends DirectoryItem> = {
  groups: DirectoryGroup<T>[];
  el: HTMLElement | null;
};

export type DirectorySlots<T extends DirectoryItem> = {
  groupLabel?: (
    props: DirectoryContext<T> & { group: DirectoryGroup<T> },
  ) => VNode[];
  item?: (props: DirectoryContext<T> & { item: T }) => VNode[];
  itemIcon?: (props: DirectoryContext<T> & { item: T }) => VNode[];
  itemLabel?: (props: DirectoryContext<T> & { item: T }) => VNode[];
};
