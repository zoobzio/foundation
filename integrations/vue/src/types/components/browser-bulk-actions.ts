import type { BulkAction, Service } from "@zoobzio/browser";
import type { VNode } from "vue";

/**
 * Props of the bulk actions bar: the headless service.
 */
export type BrowserBulkActionsProps<T> = {
  service: Service<T>;
};

/**
 * The bulk actions view model, served to `defineExpose` and the slots.
 */
export type BrowserBulkActionsContext<T> = {
  browser: Service<T>;
  el: HTMLDivElement | null;
};

/**
 * Slots of the bulk actions bar, around each action's label. Each slot
 * receives its `action`.
 */
export type BrowserBulkActionsSlots<T> = {
  bulkActionPrepend?: (
    props: BrowserBulkActionsContext<T> & { action: BulkAction },
  ) => VNode[];
  bulkActionAppend?: (
    props: BrowserBulkActionsContext<T> & { action: BulkAction },
  ) => VNode[];
};
