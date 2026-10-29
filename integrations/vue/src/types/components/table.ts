import type { AutocompleteEmits, AutocompleteProps } from "./autocomplete";
import type { FabEmits, FabProps } from "./fab";
import type { PaginationEmits, PaginationProps } from "./pagination";
import type { TableHeadPassthrough, TableHeadSlots } from "./table-head";
import type { TableBodyPassthrough, TableBodySlots } from "./table-body";
import type {
  TableColumnsPassthrough,
  TableColumnsSlots,
} from "./table-columns";
import type { TableBulkActionsSlots } from "./table-bulk-actions";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { Events, Service } from "@zoobzio/table";
import type { VNode } from "vue";

/**
 * The parts of the table that accept passthrough. `search` is the
 * autocomplete over the table's search machine.
 */
export type TablePassthrough = {
  search: Passthrough<AutocompleteProps, AutocompleteEmits>;
  refresh: Passthrough<FabProps, FabEmits>;
  pagination: Passthrough<PaginationProps, PaginationEmits>;
};

/**
 * Props of the table: the headless service plus passthrough. The table
 * owns no feature state. The service's state container must be reactive
 * for the table to update.
 */
export type TableProps<T> = {
  service: Service<T>;
  pt?: PT<TablePassthrough> & {
    head?: PT<TableHeadPassthrough>;
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
export type TableEmits<T> = {
  updated: Events<T>["updated"];
  filtered: Events<T>["filtered"];
};

/**
 * The table view model, served to `defineExpose` and the slots.
 */
export type TableContext<T> = {
  table: Service<T>;
  el: HTMLDivElement | null;
  settings: TablePassthrough;
};

/**
 * Slots of the table: its own regions plus every child slot, relayed.
 */
export type TableSlots<T> = TableHeadSlots<T> &
  TableBodySlots<T> &
  TableColumnsSlots<T> &
  TableBulkActionsSlots<T> & {
    toolbar?: (props: TableContext<T>) => VNode[];
    search?: (props: TableContext<T>) => VNode[];
    pagination?: (props: TableContext<T>) => VNode[];
    refreshPrepend?: (props: TableContext<T>) => VNode[];
    refreshAppend?: (props: TableContext<T>) => VNode[];
  };

/**
 * A table instance as data: props plus emit listeners.
 */
export type TableDefinition<T> = Definition<TableProps<T>, TableEmits<T>>;
