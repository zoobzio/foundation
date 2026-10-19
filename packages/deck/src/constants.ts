import type { MatchMode, StateKey } from "./types";

/** Default polling interval for newer items (ms). */
export const DECK_POLL_INTERVAL = 30000;

/** Default page size for fetch requests. */
export const DECK_PAGE_SIZE = 25;

/** Default filter match mode. */
export const DECK_DEFAULT_MATCH_MODE: MatchMode = "all";

/** Title labels of the common sort fields; an unknown field is capitalized. */
export const DECK_SORT_LABELS: Record<string, string> = {
  created: "Created",
  updated: "Updated",
  published: "Published",
  modified: "Modified",
};

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const DECK_STATE_FIELDS: Record<StateKey, null> = {
  items: null,
  pending: null,
  loading: null,
  loadingMore: null,
  hasMore: null,
  initialized: null,
  query: null,
  keywords: null,
  match: null,
  selectedFacets: null,
  facetGroups: null,
  sortField: null,
};
