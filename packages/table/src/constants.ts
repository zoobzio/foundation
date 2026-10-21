import type { ColumnType, SortDirection, StateKey } from "./types";

export const TABLE_DEFAULT_PAGE_SIZE = 25;
export const TABLE_DEFAULT_SORT_DIRECTION: SortDirection = "asc";
export const TABLE_DEFAULT_LOCALE = "en-US";
export const TABLE_DEFAULT_CURRENCY = "USD";

export const TABLE_DATE_OPERATORS = ["before", "after", "on"] as const;
export const TABLE_NUMBER_OPERATORS = ["over", "under", "is"] as const;

/**
 * The operators a column type accepts on a filter. A type absent here has
 * no operator stage: its filters carry no `op`.
 */
export const TABLE_OPERATORS: Partial<Record<ColumnType, readonly string[]>> = {
  date: TABLE_DATE_OPERATORS,
  datetime: TABLE_DATE_OPERATORS,
  number: TABLE_NUMBER_OPERATORS,
  currency: TABLE_NUMBER_OPERATORS,
  filesize: TABLE_NUMBER_OPERATORS,
};

/**
 * The operator a filter takes when the caller names none, by column type.
 */
export const TABLE_DEFAULT_OPERATORS: Partial<Record<ColumnType, string>> = {
  date: "on",
  datetime: "on",
  number: "is",
  currency: "is",
  filesize: "is",
};

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
  entries: null,
  draft: null,
};
