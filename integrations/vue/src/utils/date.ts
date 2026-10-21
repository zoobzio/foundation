import type { DateValue } from "@internationalized/date";
import { CalendarDate } from "@internationalized/date";

/**
 * Converts a calendar value to a UTC `Date`.
 */
export const serialize = (dv: DateValue): Date => dv.toDate("UTC");

/**
 * Converts a `Date` to a calendar date from its UTC fields.
 */
export const deserialize = (d: Date): CalendarDate =>
  new CalendarDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());

/**
 * Formats a calendar value as `YYYY-MM-DD`.
 */
export const format = (dv: DateValue): string =>
  `${dv.year}-${String(dv.month).padStart(2, "0")}-${String(dv.day).padStart(2, "0")}`;
