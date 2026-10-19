import type { SortDirection, StateKey } from "./types";

export const TABLE_DEFAULT_PAGE_SIZE = 25;
export const TABLE_DEFAULT_SORT_DIRECTION: SortDirection = "asc";

export const TABLE_DATE_OPERATORS = ["before", "after", "on"] as const;
export const TABLE_NUMBER_OPERATORS = ["over", "under", "is"] as const;

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const TABLE_STATE_FIELDS: Record<StateKey, null> = {
  data: null,
  loading: null,
  initialized: null,
  page: null,
  pageSize: null,
  total: null,
  pageCount: null,
  sortField: null,
  sortDirection: null,
  selected: null,
  columnOrder: null,
  query: null,
  filters: null,
};
