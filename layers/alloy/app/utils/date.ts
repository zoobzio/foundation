import type { DateValue } from "@internationalized/date";
import { CalendarDate } from "@internationalized/date";

const serialize = (dv: DateValue): Date => dv.toDate("UTC");

const deserialize = (d: Date): CalendarDate =>
  new CalendarDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());

const format = (dv: DateValue): string =>
  `${dv.year}-${String(dv.month).padStart(2, "0")}-${String(dv.day).padStart(2, "0")}`;

export const DateUtils = { serialize, deserialize, format };
