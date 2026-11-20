import type { Frequency, RecurrenceRule, Weekday } from "./jscalendar";

/** The weekdays in ISO order: Monday is the first day of the ISO week. */
export const TIME_WEEKDAYS: Weekday[] = [
  "mo",
  "tu",
  "we",
  "th",
  "fr",
  "sa",
  "su",
];

/** The calendar system a rule counts in where it names none. */
export const TIME_DEFAULT_SCALE = "gregorian";

/** A rule's frequency as the RRULE part it is. */
export const TIME_FREQUENCIES = {
  yearly: "YEARLY",
  monthly: "MONTHLY",
  weekly: "WEEKLY",
  daily: "DAILY",
  hourly: "HOURLY",
  minutely: "MINUTELY",
  secondly: "SECONDLY",
} as const satisfies Record<Frequency, string>;

/** A rule's skip as the RRULE part it is. */
export const TIME_SKIPS = {
  omit: "OMIT",
  backward: "BACKWARD",
  forward: "FORWARD",
} as const satisfies Record<NonNullable<RecurrenceRule["skip"]>, string>;

/** The duration of an event that names none. */
export const TIME_NO_DURATION = "PT0S";

/**
 * The pointers a recurrence override never patches: these exactly, where
 * `*` stands for any one token.
 */
export const TIME_OVERRIDE_FIXED: string[] = [
  "@type",
  "method",
  "organizerCalendarAddress",
  "participants/*/calendarAddress",
  "privacy",
  "prodId",
  "recurrenceId",
  "recurrenceIdTimeZone",
  "sentBy",
  "uid",
];

/** The properties a recurrence override never reaches into. */
export const TIME_OVERRIDE_CLOSED: string[] = [
  "recurrenceOverrides",
  "recurrenceRule",
];
