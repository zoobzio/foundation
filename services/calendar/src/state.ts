import type { Config, State } from "./types";

import { CALENDAR_DEFAULT_TIME_ZONE, CALENDAR_VIEWS } from "./constants";
import { dayOf } from "./time";

/**
 * Builds the initial state container from config defaults. The result is
 * a plain object. Wrap it in a reactive proxy to track reads and writes.
 * The calendar starts on today, as the day reads in the config's time
 * zone, in the config's view, with no entries and the config's initial
 * clauses.
 */
export const createCalendarState = (
  config: Config = {},
  now: () => Date = () => new Date(),
): State => ({
  view: config.view ?? config.views?.[0] ?? CALENDAR_VIEWS[0] ?? "month",
  date: dayOf(now(), config.timeZone ?? CALENDAR_DEFAULT_TIME_ZONE),
  entries: [],
  loading: false,
  initialized: false,
  revision: 0,
  selected: null,
  clauses: config.initialClauses ?? [],
  draft: "",
  suggest: { options: [], status: "idle", more: false },
});
