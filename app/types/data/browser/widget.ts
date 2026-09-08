import type {
  BreadcrumbEmits,
  BreadcrumbItem,
  BreadcrumbProps,
} from "../../core/breadcrumb";
import type { FabEmits, FabProps } from "../../core/fab";
import type { ScrollerEmits, ScrollerProps } from "../../core/scroller";
import type { Passthrough, PT } from "../../passthrough";
import type { Events, Service } from "../browser";
import type { BrowserFilesPassthrough, BrowserFilesSlots } from "./files";
import type {
  BrowserFoldersPassthrough,
  BrowserFoldersSlots,
} from "./folders";
import type { VNode } from "vue";

export type BrowserWidgetPassthrough = {
  breadcrumb: Passthrough<
    BreadcrumbProps<BreadcrumbItem>,
    BreadcrumbEmits<BreadcrumbItem>
  >;
  refresh: Passthrough<FabProps, FabEmits>;
  scroller: Passthrough<ScrollerProps, ScrollerEmits>;
};

export type BrowserWidgetProps<T> = {
  service: Service<T>;
  pt?: PT<BrowserWidgetPassthrough> & {
    folders?: PT<BrowserFoldersPassthrough>;
    files?: PT<BrowserFilesPassthrough>;
  };
};

export type BrowserWidgetEmits = {
  updated: Parameters<Events["browser:updated"]>;
  navigated: Parameters<Events["browser:navigated"]>;
};

export type BrowserWidgetContext<T> = {
  browser: Service<T>;
  el: HTMLDivElement | null;
  settings: BrowserWidgetPassthrough;
};

export type BrowserWidgetSlots<T> = BrowserFoldersSlots<T> &
  BrowserFilesSlots<T> & {
    toolbar?: (props: BrowserWidgetContext<T>) => VNode[];
    breadcrumb?: (props: BrowserWidgetContext<T>) => VNode[];
    empty?: (props: BrowserWidgetContext<T>) => VNode[];
  };
