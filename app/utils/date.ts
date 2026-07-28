import type { DateValue } from "@internationalized/date";
import { CalendarDate } from "@internationalized/date";

export const serialize = (dv: DateValue): Date => dv.toDate("UTC");

export const deserialize = (d: Date): CalendarDate =>
  new CalendarDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());

export const format = (dv: DateValue): string =>
  `${dv.year}-${String(dv.month).padStart(2, "0")}-${String(dv.day).padStart(2, "0")}`;
