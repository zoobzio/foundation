import type {
  BreadcrumbEmits,
  BreadcrumbItem,
  BreadcrumbProps,
} from "./breadcrumb";
import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { PT, Rendered } from "../passthrough";
import type { Service } from "@zoobzio/browser";
import type { VNode } from "vue";

/**
 * A trail crumb as a breadcrumb item: the service's crumb plus its trail
 * index, which `navigate` takes when the crumb is selected.
 */
export interface BrowserCrumbItem extends BreadcrumbItem {
  index: number;
}

/**
 * The parts of the browser head that accept passthrough. `breadcrumb` is
 * the trail from the root; `selectAllCheckbox` selects every file of the
 * folder.
 */
export type BrowserHeadPassthrough = {
  breadcrumb: Rendered<
    BreadcrumbProps<BrowserCrumbItem>,
    BreadcrumbEmits<BrowserCrumbItem>
  >;
  selectAllCheckbox: Rendered<CheckboxProps, CheckboxEmits>;
};

/**
 * Props of the browser head: the headless service plus passthrough.
 */
export type BrowserHeadProps<T> = {
  service: Service<T>;
  pt?: PT<BrowserHeadPassthrough>;
};

/**
 * The browser head view model, served to `defineExpose` and the slots.
 */
export type BrowserHeadContext<T> = {
  browser: Service<T>;
  el: HTMLTableSectionElement | null;
  settings: BrowserHeadPassthrough;
};

/**
 * The payload of a crumb slot: the head context plus the crumb, its trail
 * index, and whether it is the folder the browser stands in.
 */
export type BrowserCrumbContext<T> = BrowserHeadContext<T> & {
  item: BrowserCrumbItem;
  index: number;
  last: boolean;
};

/**
 * Slots of the browser head. `breadcrumb` replaces the trail and `summary`
 * the listing's counts beside it; `crumbPrepend` and `crumbAppend` sit
 * around each crumb's label.
 */
export type BrowserHeadSlots<T> = {
  breadcrumb?: (props: BrowserHeadContext<T>) => VNode[];
  crumbPrepend?: (props: BrowserCrumbContext<T>) => VNode[];
  crumbAppend?: (props: BrowserCrumbContext<T>) => VNode[];
  summary?: (props: BrowserHeadContext<T>) => VNode[];
};
