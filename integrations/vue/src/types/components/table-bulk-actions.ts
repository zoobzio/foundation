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
 * Slots of the bulk actions bar, around each action's label. Each slot
 * receives its `action`.
 */
export type TableBulkActionsSlots<T> = {
  bulkActionPrepend?: (
    props: TableBulkActionsContext<T> & { action: BulkAction },
  ) => VNode[];
  bulkActionAppend?: (
    props: TableBulkActionsContext<T> & { action: BulkAction },
  ) => VNode[];
};
