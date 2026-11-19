import type { Day, View } from "./types";
import type { JSCalendar, Range } from "@zoobzio/time";

import { Temporal } from "temporal-polyfill";
import { utc } from "@zoobzio/time";
import { CALENDAR_AGENDA_DAYS, CALENDAR_WEEKDAYS } from "./constants";

/** The day an instant falls on in a zone. */
export const dayOf = (now: Date, zone: JSCalendar.TimeZoneId): Day =>
  Temporal.Instant.fromEpochMilliseconds(now.getTime())
    .toZonedDateTimeISO(zone)
    .toPlainDate()
    .toString();

/** A day in its one spelling. Throws for a value that is not a day. */
export const day = (value: Day): Day =>
  Temporal.PlainDate.from(value).toString();

/** The first day of the week a day falls in. */
const weekStart = (
  value: Temporal.PlainDate,
  first: JSCalendar.Weekday,
): Temporal.PlainDate => {
  const offset = CALENDAR_WEEKDAYS.indexOf(first) + 1;
  return value.subtract({ days: (value.dayOfWeek - offset + 7) % 7 });
};

/**
 * The days a view shows around a date: the whole weeks a month touches,
 * the week, the day, or the agenda's run of days from the date.
 */
export const daysOf = (
  view: View,
  date: Day,
  first: JSCalendar.Weekday,
): Day[] => {
  const at = Temporal.PlainDate.from(date);
  let start = at;
  let count = 1;
  if (view === "month") {
    const head = at.with({ day: 1 });
    const tail = head.add({ months: 1 }).subtract({ days: 1 });
    start = weekStart(head, first);
    count = start.until(weekStart(tail, first)).days + 7;
  } else if (view === "week") {
    start = weekStart(at, first);
    count = 7;
  } else if (view === "agenda") {
    count = CALENDAR_AGENDA_DAYS;
  }
  return Array.from({ length: count }, (_, i) =>
    start.add({ days: i }).toString(),
  );
};

/**
 * The span of a run of days in a zone: from the start of the first to the
 * start of the day after the last.
 */
export const rangeOf = (days: Day[], zone: JSCalendar.TimeZoneId): Range => {
  const head = Temporal.PlainDate.from(days[0] ?? "1970-01-01");
  const tail = Temporal.PlainDate.from(days[days.length - 1] ?? head);
  return {
    start: utc(head.toZonedDateTime(zone)),
    end: utc(tail.add({ days: 1 }).toZonedDateTime(zone)),
  };
};

/** The date a view moves to, one step forward or back. */
export const step = (view: View, date: Day, direction: 1 | -1): Day => {
  const at = Temporal.PlainDate.from(date);
  if (view === "month") return at.add({ months: direction }).toString();
  const days =
    view === "week" ? 7 : view === "agenda" ? CALENDAR_AGENDA_DAYS : 1;
  return at.add({ days: days * direction }).toString();
};
