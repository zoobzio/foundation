import type { Grouping, Order, StateKey } from "./types";

export const TIMELINE_DEFAULT_KEY = "id";
export const TIMELINE_DEFAULT_AT = "at";
export const TIMELINE_DEFAULT_ORDER: Order = "desc";
export const TIMELINE_DEFAULT_GROUP: Grouping = "day";
export const TIMELINE_DEFAULT_LIMIT = 30;
export const TIMELINE_DEFAULT_TIME_ZONE = "UTC";
export const TIMELINE_DEFAULT_LOCALE = "en-US";

/**
 * How much of a day, `YYYY-MM-DD`, each grouping keeps as a group's key:
 * the day, its month, its year, or none of it.
 */
export const TIMELINE_GROUP_LENGTHS: Record<Grouping, number> = {
  day: 10,
  month: 7,
  year: 4,
  none: 0,
};

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const TIMELINE_STATE_FIELDS: Record<StateKey, null> = {
  records: null,
  cursor: null,
  loading: null,
  appending: null,
  initialized: null,
  selected: null,
  clauses: null,
  draft: null,
  suggest: null,
  interval: null,
  since: null,
  syncing: null,
};
