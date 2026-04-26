import type { ColumnType } from "../types/data-table";

export const formatCell = (value: unknown, type?: ColumnType) => {
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
