import type { StateKey, View } from "./types";
import type { JSCalendar } from "@zoobzio/time";

import { TIME_WEEKDAYS } from "@zoobzio/time";

/** The views, in the order a view offers them. */
export const CALENDAR_VIEWS: View[] = ["month", "week", "day", "agenda"];

export const CALENDAR_DEFAULT_TIME_ZONE = "UTC";
export const CALENDAR_DEFAULT_LOCALE = "en-US";
export const CALENDAR_DEFAULT_FIRST_DAY_OF_WEEK: JSCalendar.Weekday = "mo";

/** The days the agenda shows from its date. */
export const CALENDAR_AGENDA_DAYS = 30;

/** The weekdays in ISO order: Monday is the first day of the ISO week. */
export const CALENDAR_WEEKDAYS: JSCalendar.Weekday[] = TIME_WEEKDAYS;

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
  interval: null,
  since: null,
  syncing: null,
};
