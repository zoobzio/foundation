import type { Table } from "./data-table";

export type DataTableBulkActionsPassthrough = {
  root?: Passthrough<GroupProps>;
  count?: Passthrough<SpanProps>;
  action?: Passthrough<ButtonProps>;
  actionIcon?: Passthrough<IconProps>;
  clear?: Passthrough<ButtonProps>;
};

export type DataTableBulkActionsProps<T, K = unknown> = {
  table: Table<T, K>;
  pt?: DataTableBulkActionsPassthrough;
};
