import type { ColumnType,
  DataTableColumn,
  TableFilter } from "#foundation/types/data/table";

export const date = (d: Date) => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const cell = (value: unknown, type?: ColumnType) => {
  if (value == null) return "";
  switch (type) {
    case "date":
      return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
        new Date(String(value)),
      );
    case "datetime":
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(String(value)));
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(value));
    case "number":
      return new Intl.NumberFormat("en-US").format(Number(value));
    case "boolean":
      return value ? "Yes" : "No";
    default:
      return String(value);
  }
};

export const filter = <T>(
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
      return `${label}${filter.operator === "before" ? "<" : ">"}${date(v.value)}`;
    case "date_range":
      return `${label}><${date(v.value[0])},${date(v.value[1])}`;
    case "enum":
      return `${label}=${v.value.join(",")}`;
    case "boolean":
      return `${label}=${v.value}`;
  }
};
