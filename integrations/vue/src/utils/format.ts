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
 * Whether a value is a calendar day, `YYYY-MM-DD`. `Date` parses one as
 * UTC midnight, so it formats in UTC whatever the table's zone: a day has
 * no zone to shift it into the one before.
 */
const isCalendarDay = (value: unknown): boolean =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

/**
 * Formats a cell value for display by its column type. A null or undefined
 * value renders as an empty string. `locale`, `currency`, and `timeZone`
 * come from the table's config; dates and datetimes format in the zone, so
 * a server and a browser render the same text.
 */
export const cell = (
  value: unknown,
  type: ColumnType | undefined,
  locale: string,
  currency: string,
  timeZone: string,
) => {
  if (value == null) return "";
  switch (type) {
    case "date":
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeZone: isCalendarDay(value) ? "UTC" : timeZone,
      }).format(new Date(String(value)));
    case "datetime":
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone,
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
