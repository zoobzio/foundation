import type { Service } from "../browser";
import type { BulkAction } from "../table";
import type { VNode } from "vue";

export type BrowserBulkActionsProps<T> = {
  browser: Service<T>;
};

export type BrowserBulkActionsContext<T> = {
  browser: Service<T>;
  el: HTMLDivElement | null;
};

export type BrowserBulkActionsSlots<T> = {
  bulkActionIcon?: (
    props: BrowserBulkActionsContext<T> & { action: BulkAction },
  ) => VNode[];
};
