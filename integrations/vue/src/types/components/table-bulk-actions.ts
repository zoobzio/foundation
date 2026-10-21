import type { BulkAction, Service } from "@zoobzio/table";
import type { VNode } from "vue";

/**
 * Props of the bulk actions bar: the headless service.
 */
export type TableBulkActionsProps<T> = {
  service: Service<T>;
};

/**
 * The bulk actions view model, served to `defineExpose` and the slots.
 */
export type TableBulkActionsContext<T> = {
  table: Service<T>;
  el: HTMLDivElement | null;
};

/**
 * Slots of the bulk actions bar. The icon slot receives its `action`.
 */
export type TableBulkActionsSlots<T> = {
  bulkActionIcon?: (
    props: TableBulkActionsContext<T> & { action: BulkAction },
  ) => VNode[];
};
