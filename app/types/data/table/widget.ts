import type { GroupProps } from "../../common/group";
import type { TableProps } from "../../common/table";
import type { FabProps, FabEmits } from "../../core/fab";
import type {
  PaginationEmits,
  PaginationProps,
} from "../../core/pagination";
import type {
  ScrollerEmits,
  ScrollerProps,
} from "../../core/scroller";
import type { Passthrough, PT } from "../../passthrough";
import type { Service, Events } from "../table";
import type {
  TableHeadPassthrough,
  TableHeadSlots,
} from "./head";
import type {
  TableBodyPassthrough,
  TableBodySlots,
} from "./body";
import type { TableColumnsPassthrough } from "./columns";
import type { TableBulkActionsPassthrough } from "./bulk-actions";
import type { ComponentPublicInstance, VNode } from "vue";

export type TableWidgetPassthrough = {
  root: Passthrough<GroupProps>;
  toolbar: Passthrough<GroupProps>;
  refresh: Passthrough<FabProps, FabEmits>;
  scroller: Passthrough<ScrollerProps, ScrollerEmits>;
  table: Passthrough<TableProps>;
  pagination: Passthrough<PaginationProps, PaginationEmits>;
};

export type TableWidgetProps<T> = {
  service: Service<T>;
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

export type TableWidgetContext<T> = {
  table: Service<T>;
  el: ComponentPublicInstance | null;
  settings: TableWidgetPassthrough;
};

export type TableWidgetSlots<T> = TableHeadSlots<T> &
  TableBodySlots<T> & {
    toolbar?: (props: TableWidgetContext<T>) => VNode[];
    pagination?: (props: TableWidgetContext<T>) => VNode[];
  };
