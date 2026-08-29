import type { Service } from "../table";

export type TableBulkActionsProps<T> = {
  table: Service<T>;
};

export type TableBulkActionsContext<T> = {
  table: Service<T>;
  el: HTMLDivElement | null;
};
