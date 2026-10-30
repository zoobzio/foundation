import type { Option } from "../types/common";
import type { DataTableColumn, Service } from "@zoobzio/table";

/**
 * A column as a selectable option for the column manager. A pinned column
 * is disabled: it stays visible. The column's properties beyond the ones
 * the table reads (what a layer widens it with, such as an icon) are
 * carried onto the option, so the manager draws the column as the head
 * does.
 */
export const columnOption = <T>(
  table: Service<T>,
  column: DataTableColumn<T>,
): Option => {
  const {
    key,
    label,
    type: _t,
    align: _a,
    sortable: _s,
    sortKey: _k,
    filterable: _f,
    operators: _o,
    defaultOperator: _d,
    values: _v,
    ...rest
  } = column;
  return {
    ...rest,
    value: String(key),
    label,
    disabled: table.isColumnPinned(key),
  };
};
