import type { DataTableColumn, TableFilter } from "#foundation/types/data/table";
import { formatDate } from "#foundation/utils/unravel";

export const formatFilter = <T>(
  filter: TableFilter,
  columns: DataTableColumn<T>[],
) => {
  if (filter.field === "__query" && filter.value.type === "text") {
    return `"${filter.value.value}"`;
  }
  if (filter.field === "__keywords" && filter.value.type === "text") {
    return `(${filter.value.value})`;
  }
  const col = columns.find((c) => String(c.key) === filter.field);
  const label = col?.label ?? filter.field;
  const v = filter.value;
  switch (v.type) {
    case "text":
      return `${label}=${v.value}`;
    case "number":
      return `${label}${filter.operator === "eq" ? "=" : filter.operator === "gt" ? ">" : "<"}${v.value}`;
    case "number_range":
      return `${label}><${v.value[0]},${v.value[1]}`;
    case "date":
      return `${label}${filter.operator === "before" ? "<" : ">"}${formatDate(v.value)}`;
    case "date_range":
      return `${label}><${formatDate(v.value[0])},${formatDate(v.value[1])}`;
    case "enum":
      return `${label}=${v.value.join(",")}`;
    case "boolean":
      return `${label}=${v.value}`;
  }
};
