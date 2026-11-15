import type { Option } from "../types/common";
import type { Text } from "@zoobzio/kit";
import type { RowData, TableColumn, TableInstance } from "@zoobzio/table";

/**
 * A column's name: the label its `meta` carries, or its id.
 */
export const columnLabel = <T extends RowData>(column: TableColumn<T>): Text =>
  column.columnDef.meta?.label ?? column.id;

/**
 * A column as a selectable option for the column manager. A column that
 * cannot be hidden is disabled: it stays visible. A property of the
 * column's `meta` beyond the ones the table and its views read (what a
 * layer widens it with, such as an icon) is carried onto the option, so
 * the manager draws the column as the head does.
 */
export const columnOption = <T extends RowData>(
  column: TableColumn<T>,
): Option => {
  const {
    label: _b,
    type: _t,
    align: _a,
    filterable: _f,
    operators: _o,
    defaultOperator: _d,
    values: _v,
    link: _l,
    ...rest
  } = column.columnDef.meta ?? {};
  return {
    ...rest,
    value: column.id,
    label: columnLabel(column),
    disabled: !column.getCanHide(),
  };
};

/**
 * Moves a column to the slot of another, as a drag of its header does:
 * the table's column order with `key` taken out and put back where
 * `toKey` stands. An unknown or an equal key moves nothing.
 */
export const moveColumn = <T extends RowData>(
  table: TableInstance<T>,
  key: string,
  toKey: string,
): void => {
  if (key === toKey) return;
  const order = table.getAllLeafColumns().map((column) => column.id);
  const from = order.indexOf(key);
  const to = order.indexOf(toKey);
  if (from === -1 || to === -1) return;
  order.splice(from, 1);
  order.splice(to, 0, key);
  table.setColumnOrder(order);
};

/**
 * Whether the table's rows select at all: the head and the body render
 * their checkbox column unless the table's `enableRowSelection` is off.
 */
export const isSelectable = <T extends RowData>(
  table: TableInstance<T>,
): boolean => table.options.enableRowSelection !== false;

/**
 * The state of the head's checkbox over the rows of the page: all of them
 * selected, some, or none.
 */
export const selectAllState = <T extends RowData>(
  table: TableInstance<T>,
): boolean | "indeterminate" => {
  if (table.getIsAllPageRowsSelected()) return true;
  return table.getIsSomePageRowsSelected() ? "indeterminate" : false;
};

/**
 * The width a column's `col` holds: the column's size, but for the last
 * visible column, which holds none and so takes what the table has left
 * once it is wider than its columns.
 */
export const columnWidth = <T extends RowData>(
  column: TableColumn<T>,
): number | undefined =>
  column.getIsLastColumn() ? undefined : column.getSize();
