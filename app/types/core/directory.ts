import type { AnchorEmits, AnchorProps } from "../common/anchor";
import type { ButtonEmits, ButtonProps } from "../common/button";
import type { CaptionProps } from "../common/caption";
import type { GroupProps } from "../common/group";
import type { IconProps } from "../common/icon";
import type { IconAlias } from "../common/iconic";
import type { LiProps } from "../common/li";
import type { NavProps } from "../common/nav";
import type { SpanProps } from "../common/span";
import type { UlProps } from "../common/ul";
import type { Link } from "./common";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { ComponentPublicInstance, VNode } from "vue";

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

export type DirectoryPassthrough<T extends DirectoryItem = DirectoryItem> = {
  root: Passthrough<NavProps>;
  group: Passthrough<GroupProps>;
  groupLabel: Passthrough<CaptionProps>;
  list: Passthrough<UlProps>;
  item: PassthroughIter<T, LiProps>;
  itemAnchor: PassthroughIter<T, AnchorProps, AnchorEmits>;
  itemButton: PassthroughIter<T, ButtonProps, ButtonEmits>;
  itemIcon: PassthroughIter<T, IconProps>;
  itemLabel: Passthrough<SpanProps>;
};

export type DirectoryProps<T extends DirectoryItem> = {
  groups: DirectoryGroup<T>[];
  pt?: PT<DirectoryPassthrough<T>>;
};

export type DirectoryEmits<T extends DirectoryItem> =
  {
    select: [item: T];
  };

export type DirectoryContext<T extends DirectoryItem> = {
  groups: DirectoryGroup<T>[];
  el: ComponentPublicInstance | null;
  settings: DirectoryPassthrough<T>;
};

export type DirectorySlots<T extends DirectoryItem> = {
  groupLabel?: (
    props: DirectoryContext<T> & { group: DirectoryGroup<T> },
  ) => VNode[];
  item?: (props: DirectoryContext<T> & { item: T }) => VNode[];
  itemIcon?: (props: DirectoryContext<T> & { item: T }) => VNode[];
  itemLabel?: (props: DirectoryContext<T> & { item: T }) => VNode[];
};
