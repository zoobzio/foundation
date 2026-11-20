import type { TimeZoneId, Weekday } from "./jscalendar";
import type { Day } from "./types";

import { Temporal } from "temporal-polyfill";
import { TIME_WEEKDAYS } from "./constants";

/** The day an instant falls on in a zone. */
export const dayOf = (now: Date, zone: TimeZoneId): Day =>
  Temporal.Instant.fromEpochMilliseconds(now.getTime())
    .toZonedDateTimeISO(zone)
    .toPlainDate()
    .toString();

/** A day in its one spelling. Throws for a value that is not a day. */
export const day = (value: Day): Day =>
  Temporal.PlainDate.from(value).toString();

/** The first day of the week a day falls in, where weeks start on `first`. */
export const weekStart = (
  value: Temporal.PlainDate,
  first: Weekday,
): Temporal.PlainDate => {
  const offset = TIME_WEEKDAYS.indexOf(first) + 1;
  return value.subtract({ days: (value.dayOfWeek - offset + 7) % 7 });
};
