import type { GroupProps } from "#foundation/types/common/group";
import type { TableProps } from "#foundation/types/common/table";
import type { PaginationEmits, PaginationProps } from "#foundation/types/core/pagination";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { ScrollerEmits, ScrollerProps } from "#foundation/types/core/scroller";
import type { Table } from "#foundation/types/data/table";
import type { DataTableFiltersPassthrough } from "#foundation/types/data/table-filters";
import type { DataTableColumnsPassthrough } from "#foundation/types/data/table-columns";
import type { DataTableHeadPassthrough } from "#foundation/types/data/table-head";
import type { DataTableBodyPassthrough } from "#foundation/types/data/table-body";
import type { DataTableBulkActionsPassthrough } from "#foundation/types/data/table-bulk-actions";

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
