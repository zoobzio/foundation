import type { GroupProps } from "#foundation/types/common/group";
import type { TableProps } from "#foundation/types/common/table";
import type { FabProps, FabEmits } from "#foundation/types/core/fab";
import type {
  PaginationEmits,
  PaginationProps,
} from "#foundation/types/core/pagination";
import type {
  ScrollerEmits,
  ScrollerProps,
} from "#foundation/types/core/scroller";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { Table, Events } from "#foundation/types/data/table";
import type {
  TableHeadPassthrough,
  TableHeadSlots,
} from "#foundation/types/data/table/head";
import type {
  TableBodyPassthrough,
  TableBodySlots,
} from "#foundation/types/data/table/body";
import type { TableColumnsPassthrough } from "#foundation/types/data/table/columns";
import type { TableBulkActionsPassthrough } from "#foundation/types/data/table/bulk-actions";
import type { ComponentPublicInstance, VNode } from "vue";

export type TableWidgetPassthrough = {
  root: Passthrough<GroupProps>;
  toolbar: Passthrough<GroupProps>;
  refresh: Passthrough<FabProps, FabEmits>;
  scroller: Passthrough<ScrollerProps, ScrollerEmits>;
  table: Passthrough<TableProps>;
  pagination: Passthrough<PaginationProps, PaginationEmits>;
};

export type TableWidgetProps<T, K = unknown> = {
  table: Table<T, K>;
  pt?: PT<TableWidgetPassthrough> & {
    head?: PT<TableHeadPassthrough>;
    body?: PT<TableBodyPassthrough>;
    columns?: PT<TableColumnsPassthrough>;
    bulkActions?: PT<TableBulkActionsPassthrough>;
  };
};

export type TableWidgetEmits = {
  updated: Parameters<Events["table:updated"]>;
};

export type TableWidgetContext<T, K = unknown> = {
  table: Table<T, K>;
  el: ComponentPublicInstance | null;
  settings: TableWidgetPassthrough;
};

export type TableWidgetSlots<T, K = unknown> = TableHeadSlots<T, K> &
  TableBodySlots<T, K> & {
    toolbar?: (props: TableWidgetContext<T, K>) => VNode[];
    pagination?: (props: TableWidgetContext<T, K>) => VNode[];
  };
