import type { Option } from "../types/common";
import type { TablePinItem } from "../types/components/table-head";
import type { Text } from "@zoobzio/kit";
import type { RowData, TableColumn, TableInstance } from "@zoobzio/table";

import { TABLE_PIN_LABELS } from "../constants/table";

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
 * The visible columns as the table lays them out: the ones pinned to the
 * start, the unpinned ones in the column order, then the ones pinned to
 * the end. The head's cells and a row's stand in this order.
 */
export const layoutColumns = <T extends RowData>(
  table: TableInstance<T>,
): TableColumn<T>[] => [
  ...table.getStartVisibleLeafColumns(),
  ...table.getCenterVisibleLeafColumns(),
  ...table.getEndVisibleLeafColumns(),
];

/**
 * Whether two columns stand in the same region: both pinned to the same
 * side, or neither pinned. A drag moves a column within its region only.
 */
export const sameRegion = <T extends RowData>(
  table: TableInstance<T>,
  key: string,
  toKey: string,
): boolean => {
  const from = table.getColumn(key);
  const to = table.getColumn(toKey);
  return !!from && !!to && from.getIsPinned() === to.getIsPinned();
};

/**
 * Moves a column to the slot of another, as a drag of its header does.
 * Between two unpinned columns it is the table's column order with `key`
 * taken out and put back where `toKey` stands; between two columns pinned
 * to the same side, that side's pinning order. An unknown or an equal
 * key, or a column of another region, moves nothing: pinning is what
 * takes a column from one region to another.
 */
export const moveColumn = <T extends RowData>(
  table: TableInstance<T>,
  key: string,
  toKey: string,
): void => {
  if (key === toKey || !sameRegion(table, key, toKey)) return;
  const region = table.getColumn(key)?.getIsPinned();
  const order = region
    ? [...table.atoms.columnPinning.get()[region]]
    : table.getAllLeafColumns().map((column) => column.id);
  const from = order.indexOf(key);
  const to = order.indexOf(toKey);
  if (from === -1 || to === -1) return;
  order.splice(from, 1);
  order.splice(to, 0, key);
  if (region) {
    table.setColumnPinning((pinning) => ({ ...pinning, [region]: order }));
  } else {
    table.setColumnOrder(order);
  }
};

/**
 * The classes of a pinned column's cells, in the head and in the body:
 * `f-data-table-pinned` with the side it is pinned to, and
 * `f-data-table-pinned-edge` on the column that borders the unpinned
 * ones. An unpinned column carries none.
 */
export const pinClass = <T extends RowData>(
  column: TableColumn<T>,
): Record<string, boolean> => {
  const pinned = column.getIsPinned();
  return {
    "f-data-table-pinned": pinned !== false,
    "f-data-table-pinned-start": pinned === "start",
    "f-data-table-pinned-end": pinned === "end",
    "f-data-table-pinned-edge":
      (pinned === "start" && column.getIsLastColumn("start")) ||
      (pinned === "end" && column.getIsFirstColumn("end")),
  };
};

/**
 * Where a pinned column's cells stick: the widths of the pinned columns
 * between it and its side of the table, past
 * `--f-data-table-start-inset` or `--f-data-table-end-inset`, the room the
 * stylesheet keeps for the checkbox column and the actions column. An
 * unpinned column has none.
 */
export const pinStyle = <T extends RowData>(
  column: TableColumn<T>,
): Record<string, string> | undefined => {
  const pinned = column.getIsPinned();
  if (pinned === "start") {
    return {
      insetInlineStart: `calc(var(--f-data-table-start-inset, 0px) + ${column.getStart("start")}px)`,
    };
  }
  if (pinned === "end") {
    return {
      insetInlineEnd: `calc(var(--f-data-table-end-inset, 0px) + ${column.getAfter("end")}px)`,
    };
  }
  return undefined;
};

/**
 * What a column's pin menu offers: each side the column is not pinned to,
 * and to unpin it once it is pinned.
 */
export const pinItems = <T extends RowData>(
  column: TableColumn<T>,
  labels: Record<TablePinItem["key"], Text> = TABLE_PIN_LABELS,
): TablePinItem[] => {
  const pinned = column.getIsPinned();
  const keys = (["start", "end", "none"] as const).filter((key) =>
    key === "none" ? pinned !== false : pinned !== key,
  );
  return keys.map((key) => ({ key, label: labels[key] }));
};

/**
 * Whether the table's rows select at all: the head and the body render
 * their checkbox column unless the table's `enableRowSelection` is off,
 * as it is without bulk actions or the permissions to select and run them.
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
 * visible unpinned column, which holds none and so takes what the table
 * has left once it is wider than its columns. A pinned column always
 * holds its size, which is what the columns beside it stick past.
 */
export const columnWidth = <T extends RowData>(
  column: TableColumn<T>,
): number | undefined =>
  column.getIsLastColumn("center") ? undefined : column.getSize();
