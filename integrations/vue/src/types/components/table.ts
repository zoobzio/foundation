import type { AutocompleteEmits, AutocompleteProps } from "./autocomplete";
import type { FabEmits, FabProps } from "./fab";
import type { MenuEmits, MenuProps } from "./menu";
import type { PaginationEmits, PaginationProps } from "./pagination";
import type { ScrollerProps } from "./scroller";
import type { SyncItem } from "./sync";
import type { TableHeadPassthrough, TableHeadSlots } from "./table-head";
import type { TableBodyPassthrough, TableBodySlots } from "./table-body";
import type {
  TableColumnsPassthrough,
  TableColumnsSlots,
} from "./table-columns";
import type { TableBulkActionsSlots } from "./table-bulk-actions";
import type { PT, Rendered } from "../passthrough";
import type { Definition } from "../definition";
import type { Events, RowData, Service } from "@zoobzio/table";
import type { VNode } from "vue";

/**
 * The parts of the table that accept passthrough. `search` is the
 * autocomplete over the table's search machine. `refresh` fetches the
 * page again; where the table has a sync it is the trigger of `syncMenu`
 * instead, which refreshes at once or sets the interval the page is kept
 * alive on. `scroller` is the scroll area around the `table` element,
 * which scrolls it on the inline axis once its columns outgrow the space
 * the table has.
 */
export type TablePassthrough = {
  search: Rendered<AutocompleteProps, AutocompleteEmits>;
  refresh: Rendered<FabProps, FabEmits>;
  syncMenu: Rendered<MenuProps<SyncItem>, MenuEmits<SyncItem>>;
  scroller: Rendered<ScrollerProps>;
  pagination: Rendered<PaginationProps, PaginationEmits>;
};

/**
 * Props of the table: the headless service plus passthrough. The table
 * owns no feature state. The service's state container must be reactive
 * for the table to update.
 */
export type TableProps<T extends RowData> = {
  service: Service<T>;
  pt?: PT<TablePassthrough> & {
    head?: PT<TableHeadPassthrough<T>>;
    body?: PT<TableBodyPassthrough<T>>;
    columns?: PT<TableColumnsPassthrough>;
  };
};

/**
 * Emits of the table: the service's domain events, relayed with the
 * service's payloads. Literal keys, not a `Pick`: `@vue/compiler-sfc` must
 * fold the emit keys statically for `defineEmits`. `TABLE_EVENTS` names the
 * relayed subset and is checked against these keys.
 */
export type TableEmits<T extends RowData> = {
  updated: Events<T>["updated"];
  filtered: Events<T>["filtered"];
};

/**
 * The table view model, served to `defineExpose` and the slots.
 */
export type TableContext<T extends RowData> = {
  table: Service<T>;
  el: HTMLDivElement | null;
  settings: TablePassthrough;
};

/**
 * Slots of the table: its own regions plus every child slot, relayed.
 * `refresh` replaces the refresh button, which is the sync menu's trigger
 * where the table has a sync; `syncPrepend` and `syncAppend` sit around
 * each of that menu's items, and `syncLabel` replaces an item's label.
 */
export type TableSlots<T extends RowData> = TableHeadSlots<T> &
  TableBodySlots<T> &
  TableColumnsSlots<T> &
  TableBulkActionsSlots<T> & {
    toolbar?: (props: TableContext<T>) => VNode[];
    search?: (props: TableContext<T>) => VNode[];
    pagination?: (props: TableContext<T>) => VNode[];
    refresh?: (props: TableContext<T>) => VNode[];
    syncPrepend?: (props: TableContext<T> & { item: SyncItem }) => VNode[];
    syncLabel?: (props: TableContext<T> & { item: SyncItem }) => VNode[];
    syncAppend?: (props: TableContext<T> & { item: SyncItem }) => VNode[];
  };

/**
 * A table instance as data: props plus emit listeners.
 */
export type TableDefinition<T extends RowData> = Definition<
  TableProps<T>,
  TableEmits<T>
>;
