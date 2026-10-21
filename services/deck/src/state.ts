import type { Config, State } from "./types";

import { DECK_DEFAULT_MATCH_MODE } from "./constants";

/**
 * Builds the initial state container from config defaults. The result is a
 * plain object. Wrap it in a reactive proxy to track reads and writes. Sort
 * defaults to the first declared date field.
 */
export const createDeckState = <T>(config: Config<T>): State<T> => ({
  items: [],
  pending: [],
  loading: false,
  loadingMore: false,
  hasMore: true,
  initialized: false,
  query: "",
  keywords: "",
  match: DECK_DEFAULT_MATCH_MODE,
  selectedFacets: new Set(),
  facetGroups: [],
  sortField: String(config.dateFields[0]?.key ?? "created"),
});
