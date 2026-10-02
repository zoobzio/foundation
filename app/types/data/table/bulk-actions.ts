import type { BulkAction, Service } from "../table";
import type { VNode } from "vue";

export type TableBulkActionsProps<T> = {
  table: Service<T>;
};

export type TableBulkActionsContext<T> = {
  table: Service<T>;
  el: HTMLDivElement | null;
};

export type TableBulkActionsSlots<T> = {
  bulkActionIcon?: (
    props: TableBulkActionsContext<T> & { action: BulkAction },
  ) => VNode[];
};
