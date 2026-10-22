import type {
  BreadcrumbEmits,
  BreadcrumbItem,
  BreadcrumbProps,
} from "./breadcrumb";
import type { FabEmits, FabProps } from "./fab";
import type { ScrollerEmits, ScrollerProps } from "./scroller";
import type {
  BrowserFoldersPassthrough,
  BrowserFoldersSlots,
} from "./browser-folders";
import type {
  BrowserFilesPassthrough,
  BrowserFilesSlots,
} from "./browser-files";
import type { BrowserBulkActionsSlots } from "./browser-bulk-actions";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { Events, Service } from "@zoobzio/browser";
import type { VNode } from "vue";

/**
 * A trail crumb as a breadcrumb item: the service's crumb plus its trail
 * index, which `navigate` takes when the crumb is selected.
 */
export type BrowserCrumbItem = BreadcrumbItem & { index: number };

/**
 * The parts of the browser that accept passthrough. `breadcrumb` is the
 * trail from the root; `refresh` refetches the current folder.
 */
export type BrowserPassthrough = {
  breadcrumb: Passthrough<
    BreadcrumbProps<BrowserCrumbItem>,
    BreadcrumbEmits<BrowserCrumbItem>
  >;
  refresh: Passthrough<FabProps, FabEmits>;
  scroller: Passthrough<ScrollerProps, ScrollerEmits>;
};

/**
 * Props of the browser: the headless service plus passthrough. The browser
 * owns no feature state. The service's state container must be reactive
 * for the browser to update.
 */
export type BrowserProps<T> = {
  service: Service<T>;
  pt?: PT<BrowserPassthrough> & {
    folders?: PT<BrowserFoldersPassthrough>;
    files?: PT<BrowserFilesPassthrough>;
  };
};

/**
 * Emits of the browser: the service's domain events, relayed with the
 * service's payloads. Literal keys, not a `Pick`: `@vue/compiler-sfc` must
 * fold the emit keys statically for `defineEmits`. `BROWSER_EVENTS` names
 * the relayed subset and is checked against these keys.
 */
export type BrowserEmits<T> = {
  updated: Events<T>["updated"];
  navigated: Events<T>["navigated"];
};

/**
 * The browser view model, served to `defineExpose` and the slots.
 */
export type BrowserContext<T> = {
  browser: Service<T>;
  el: HTMLDivElement | null;
  settings: BrowserPassthrough;
};

/**
 * Slots of the browser: its own regions plus every child slot, relayed.
 * `empty` replaces the whole body once a folder settles with neither
 * folders nor files.
 */
export type BrowserSlots<T> = BrowserFoldersSlots<T> &
  BrowserFilesSlots<T> &
  BrowserBulkActionsSlots<T> & {
    toolbar?: (props: BrowserContext<T>) => VNode[];
    refreshIcon?: (props: BrowserContext<T>) => VNode[];
    breadcrumb?: (props: BrowserContext<T>) => VNode[];
    empty?: (props: BrowserContext<T>) => VNode[];
  };

/**
 * A browser instance as data: props plus emit listeners.
 */
export type BrowserDefinition<T> = Definition<BrowserProps<T>, BrowserEmits<T>>;
