import type { LinkTarget } from "../common";
import type { Definition } from "../definition";
import type { VNode } from "vue";

/**
 * A breadcrumb entry. An ancestor with `link` renders as an anchor. An ancestor
 * without `link` renders as a button and only emits `select`. The last item is
 * the current page and renders as inert text. Extra fields pass through to the
 * emit.
 */
export type BreadcrumbItem = {
  key: string;
  label: string;
  disabled?: boolean;
  link?: LinkTarget;
};

/**
 * Props of the breadcrumb.
 */
export type BreadcrumbProps<T extends BreadcrumbItem> = {
  items: T[];
};

/**
 * Emits of the breadcrumb.
 */
export type BreadcrumbEmits<T extends BreadcrumbItem> = {
  select: [item: T];
};

/**
 * The breadcrumb view model, served to `defineExpose` and the slots.
 */
export type BreadcrumbContext<T extends BreadcrumbItem> = {
  items: T[];
  el: HTMLElement | null;
};

/**
 * Slots of the breadcrumb. Item slots also receive the `item`, its `index`, and
 * `last`.
 */
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

/**
 * A breadcrumb instance as data: props plus emit listeners.
 */
export type BreadcrumbDefinition<T extends BreadcrumbItem> = Definition<
  BreadcrumbProps<T>,
  BreadcrumbEmits<T>
>;
