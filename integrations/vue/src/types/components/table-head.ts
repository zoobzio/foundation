import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { FabProps } from "./fab";
import type { MenuEmits, MenuItem, MenuProps } from "./menu";
import type {
  PT,
  PassthroughIter,
  Rendered,
  RenderedIter,
} from "../passthrough";
import type { RowData, Service, TableColumn } from "@zoobzio/table";
import type { HTMLAttributes, VNode } from "vue";

/**
 * An item of a column's pin menu: `start` and `end` pin the column to
 * that side of the table, `none` unpins it.
 */
export interface TablePinItem extends MenuItem {
  key: "start" | "end" | "none";
}

/**
 * The parts of the table head that accept passthrough. `resizer` is the
 * handle on a column's trailing border, built per column: a focusable
 * separator named for the column, whose value is the column's width.
 * `pinMenu` and `pinTrigger` are the menu a column is pinned from and the
 * button that opens it, built per column.
 */
export type TableHeadPassthrough<T extends RowData> = {
  selectAllCheckbox: Rendered<CheckboxProps, CheckboxEmits>;
  resizer: PassthroughIter<TableColumn<T>, HTMLAttributes>;
  pinMenu: RenderedIter<
    TableColumn<T>,
    MenuProps<TablePinItem>,
    MenuEmits<TablePinItem>
  >;
  pinTrigger: RenderedIter<TableColumn<T>, FabProps>;
};

/**
 * Props of the table head: the headless service plus passthrough.
 */
export type TableHeadProps<T extends RowData> = {
  service: Service<T>;
  pt?: PT<TableHeadPassthrough<T>>;
};

/**
 * The table head view model, served to `defineExpose` and the slots.
 */
export type TableHeadContext<T extends RowData> = {
  table: Service<T>;
  el: HTMLTableSectionElement | null;
  settings: TableHeadPassthrough<T>;
};

/**
 * Slots of the table head. Each slot receives the context and its `column`.
 */
export type TableHeadSlots<T extends RowData> = {
  header?: (props: TableHeadContext<T> & { column: TableColumn<T> }) => VNode[];
  headerPrepend?: (
    props: TableHeadContext<T> & { column: TableColumn<T> },
  ) => VNode[];
  headerAppend?: (
    props: TableHeadContext<T> & { column: TableColumn<T> },
  ) => VNode[];
  dragPrepend?: (
    props: TableHeadContext<T> & { column: TableColumn<T> },
  ) => VNode[];
  dragAppend?: (
    props: TableHeadContext<T> & { column: TableColumn<T> },
  ) => VNode[];
  /** Replaces the button that opens a column's pin menu. */
  pin?: (props: TableHeadContext<T> & { column: TableColumn<T> }) => VNode[];
  pinPrepend?: (
    props: TableHeadContext<T> & { column: TableColumn<T>; item: TablePinItem },
  ) => VNode[];
  pinAppend?: (
    props: TableHeadContext<T> & { column: TableColumn<T>; item: TablePinItem },
  ) => VNode[];
};
