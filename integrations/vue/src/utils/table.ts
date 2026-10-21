import type { Option } from "../types/common";
import type { DataTableColumn, Service } from "@zoobzio/table";

/**
 * A column as a selectable option for the column manager. A pinned column
 * is disabled: it stays visible.
 */
export const columnOption = <T>(
  table: Service<T>,
  column: DataTableColumn<T>,
): Option => ({
  value: String(column.key),
  label: column.label,
  disabled: table.isColumnPinned(column.key),
});
