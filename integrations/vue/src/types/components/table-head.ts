import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { PT, PassthroughIter, Rendered } from "../passthrough";
import type { RowData, Service, TableColumn } from "@zoobzio/table";
import type { HTMLAttributes, VNode } from "vue";

/**
 * The parts of the table head that accept passthrough. `resizer` is the
 * handle on a column's trailing border, built per column: a focusable
 * separator named for the column, whose value is the column's width.
 */
export type TableHeadPassthrough<T extends RowData> = {
  selectAllCheckbox: Rendered<CheckboxProps, CheckboxEmits>;
  resizer: PassthroughIter<TableColumn<T>, HTMLAttributes>;
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
};
