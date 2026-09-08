import type { IconAlias } from "../icon";
import type { Link } from "./common";
import type { VNode } from "vue";

/**
 * A breadcrumb entry: one step on the trail from root to the current
 * location. Ancestors activate on click — `link` makes an ancestor a real
 * hyperlink rendered through NuxtLink, native navigation semantics intact;
 * without it the ancestor renders as a button and only the `select` emit
 * fires. The last item is the current location: always inert text with
 * `aria-current="page"`, never a link or button. Consumers extend the item
 * with their own fields and receive them back in the emit.
 */
export type BreadcrumbItem = {
  key: string;
  label: string;
  icon?: IconAlias;
  disabled?: boolean;
  link?: Pick<Link, "to" | "external" | "target" | "replace" | "prefetch">;
};

export type BreadcrumbProps<T extends BreadcrumbItem> = {
  items: T[];
};

export type BreadcrumbEmits<T extends BreadcrumbItem> = {
  select: [item: T];
};

export type BreadcrumbContext<T extends BreadcrumbItem> = {
  items: T[];
  el: HTMLElement | null;
};

export type BreadcrumbSlots<T extends BreadcrumbItem> = {
  item?: (
    props: BreadcrumbContext<T> & { item: T; index: number; last: boolean },
  ) => VNode[];
  itemIcon?: (
    props: BreadcrumbContext<T> & { item: T; index: number; last: boolean },
  ) => VNode[];
  itemLabel?: (
    props: BreadcrumbContext<T> & { item: T; index: number; last: boolean },
  ) => VNode[];
  separator?: (
    props: BreadcrumbContext<T> & { item: T; index: number },
  ) => VNode[];
};
