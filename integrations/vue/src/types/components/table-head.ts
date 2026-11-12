import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { PT, PassthroughIter, Rendered } from "../passthrough";
import type { DataTableColumn, Service } from "@zoobzio/table";
import type { HTMLAttributes, VNode } from "vue";

/**
 * The parts of the table head that accept passthrough. `resizer` is the
 * handle on a column's trailing border, built per column: a focusable
 * separator named for the column, whose value is the column's width.
 */
export type TableHeadPassthrough<T> = {
  selectAllCheckbox: Rendered<CheckboxProps, CheckboxEmits>;
  resizer: PassthroughIter<DataTableColumn<T>, HTMLAttributes>;
};

/**
 * Props of the table head: the headless service plus passthrough.
 */
export type TableHeadProps<T> = {
  service: Service<T>;
  pt?: PT<TableHeadPassthrough<T>>;
};

/**
 * The table head view model, served to `defineExpose` and the slots.
 */
export type TableHeadContext<T> = {
  table: Service<T>;
  el: HTMLTableSectionElement | null;
  settings: TableHeadPassthrough<T>;
};

/**
 * Slots of the table head. Each slot receives the context and its `column`.
 */
export type TableHeadSlots<T> = {
  header?: (
    props: TableHeadContext<T> & { column: DataTableColumn<T> },
  ) => VNode[];
  headerPrepend?: (
    props: TableHeadContext<T> & { column: DataTableColumn<T> },
  ) => VNode[];
  headerAppend?: (
    props: TableHeadContext<T> & { column: DataTableColumn<T> },
  ) => VNode[];
  dragPrepend?: (
    props: TableHeadContext<T> & { column: DataTableColumn<T> },
  ) => VNode[];
  dragAppend?: (
    props: TableHeadContext<T> & { column: DataTableColumn<T> },
  ) => VNode[];
};
