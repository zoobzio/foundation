import type { SortDirection, StateKey } from "./types";

/** Default file sort direction. */
export const BROWSER_DEFAULT_SORT_DIRECTION: SortDirection = "asc";

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
