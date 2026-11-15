import type { BulkAction, RowData, Service } from "@zoobzio/table";
import type { VNode } from "vue";

/**
 * Props of the bulk actions bar: the headless service.
 */
export type TableBulkActionsProps<T extends RowData> = {
  service: Service<T>;
};

/**
 * The bulk actions view model, served to `defineExpose` and the slots.
 */
export type TableBulkActionsContext<T extends RowData> = {
  table: Service<T>;
  el: HTMLDivElement | null;
};

/**
 * Slots of the bulk actions bar, around each action's label. Each slot
 * receives its `action`.
 */
export type TableBulkActionsSlots<T extends RowData> = {
  bulkActionPrepend?: (
    props: TableBulkActionsContext<T> & { action: BulkAction },
  ) => VNode[];
  bulkActionAppend?: (
    props: TableBulkActionsContext<T> & { action: BulkAction },
  ) => VNode[];
  bulkClear?: (props: TableBulkActionsContext<T>) => VNode[];
};
