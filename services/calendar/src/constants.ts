import type { StateKey, View } from "./types";
import type { Frequency, RecurrenceRule, Weekday } from "./jscalendar";

/** The views, in the order a view offers them. */
export const CALENDAR_VIEWS: View[] = ["month", "week", "day", "agenda"];

export const CALENDAR_DEFAULT_TIME_ZONE = "UTC";
export const CALENDAR_DEFAULT_LOCALE = "en-US";
export const CALENDAR_DEFAULT_FIRST_DAY_OF_WEEK: Weekday = "mo";

/** The days the agenda shows from its date. */
export const CALENDAR_AGENDA_DAYS = 30;

/** The weekdays in ISO order: Monday is the first day of the ISO week. */
export const CALENDAR_WEEKDAYS: Weekday[] = [
  "mo",
  "tu",
  "we",
  "th",
  "fr",
  "sa",
  "su",
];

/** The calendar system a rule counts in where it names none. */
export const CALENDAR_DEFAULT_SCALE = "gregorian";

/** A rule's frequency as the RRULE part it is. */
export const CALENDAR_FREQUENCIES = {
  yearly: "YEARLY",
  monthly: "MONTHLY",
  weekly: "WEEKLY",
  daily: "DAILY",
  hourly: "HOURLY",
  minutely: "MINUTELY",
  secondly: "SECONDLY",
} as const satisfies Record<Frequency, string>;

/** A rule's skip as the RRULE part it is. */
export const CALENDAR_SKIPS = {
  omit: "OMIT",
  backward: "BACKWARD",
  forward: "FORWARD",
} as const satisfies Record<NonNullable<RecurrenceRule["skip"]>, string>;

/** The duration of an event that names none. */
export const CALENDAR_NO_DURATION = "PT0S";

/**
 * The pointers a recurrence override never patches: these exactly, where
 * `*` stands for any one token.
 */
export const CALENDAR_OVERRIDE_FIXED: string[] = [
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
export const CALENDAR_OVERRIDE_CLOSED: string[] = [
  "recurrenceOverrides",
  "recurrenceRule",
];

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const CALENDAR_STATE_FIELDS: Record<StateKey, null> = {
  view: null,
  date: null,
  entries: null,
  loading: null,
  initialized: null,
  revision: null,
  selected: null,
  clauses: null,
  draft: null,
  suggest: null,
};
