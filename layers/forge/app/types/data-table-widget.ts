import type { Table } from "./data-table";
import type { DataTableFiltersPassthrough } from "./data-table-filters";
import type { DataTableColumnsPassthrough } from "./data-table-columns";
import type { DataTableHeadPassthrough } from "./data-table-head";
import type { DataTableBodyPassthrough } from "./data-table-body";
import type { DataTableBulkActionsPassthrough } from "./data-table-bulk-actions";

export type DataTablePassthrough = {
  root?: Passthrough<GroupProps>;
  toolbar?: Passthrough<GroupProps>;
  scroller?: Passthrough<ScrollerProps, ScrollerEmits>;
  table?: Passthrough<TableProps>;
  pagination?: Passthrough<PaginationProps, PaginationEmits>;

  // Sub-component passthrough
  filters?: DataTableFiltersPassthrough;
  columns?: DataTableColumnsPassthrough;
  head?: DataTableHeadPassthrough;
  body?: DataTableBodyPassthrough;
  bulkActions?: DataTableBulkActionsPassthrough;
};

export type DataTableProps<T, K = unknown> = {
  table: Table<T, K>;
  pt?: DataTablePassthrough;
};
