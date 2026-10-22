import type { SortDirection, StateKey } from "./types";

/** Default file sort direction. */
export const BROWSER_DEFAULT_SORT_DIRECTION: SortDirection = "asc";

/** The key of the root crumb: the trail's first entry, above every folder. */
export const BROWSER_ROOT_KEY = "";

/** The label of the root crumb when the config names none. */
export const BROWSER_DEFAULT_ROOT_LABEL = "Home";

/** The locale cells format in when the config names none. */
export const BROWSER_DEFAULT_LOCALE = "en-US";

/** The currency code currency cells format in when the config names none. */
export const BROWSER_DEFAULT_CURRENCY = "USD";

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const BROWSER_STATE_FIELDS: Record<StateKey, null> = {
  folders: null,
  files: null,
  loading: null,
  initialized: null,
  path: null,
  sortField: null,
  sortDirection: null,
  selected: null,
};
