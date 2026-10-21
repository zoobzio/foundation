import type { ColumnType } from "@zoobzio/table";

/**
 * Formats a date as `YYYY-MM-DD` in UTC.
 */
export const date = (d: Date) => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/**
 * Formats a cell value for display by its column type. A null or undefined
 * value renders as an empty string. `locale` and `currency` come from the
 * table's config.
 */
export const cell = (
  value: unknown,
  type: ColumnType | undefined,
  locale: string,
  currency: string,
) => {
  if (value == null) return "";
  switch (type) {
    case "date":
      return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
        new Date(String(value)),
      );
    case "datetime":
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(String(value)));
    case "currency":
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(Number(value));
    case "number":
      return new Intl.NumberFormat(locale).format(Number(value));
    case "filesize": {
      const units = [
        "byte",
        "kilobyte",
        "megabyte",
        "gigabyte",
        "terabyte",
      ] as const;
      let size = Number(value);
      let unit = 0;
      while (size >= 1024 && unit < units.length - 1) {
        size /= 1024;
        unit += 1;
      }
      return new Intl.NumberFormat(locale, {
        style: "unit",
        unit: units[unit],
        unitDisplay: "short",
        maximumFractionDigits: 1,
      }).format(size);
    }
    case "boolean":
      return value ? "Yes" : "No";
    default:
      return String(value);
  }
};
