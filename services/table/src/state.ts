import type { Config, DataTableColumn, State } from "./types";

import {
  TABLE_DEFAULT_PAGE_SIZE,
  TABLE_DEFAULT_SORT_DIRECTION,
} from "./constants";

/**
 * The widths the columns declare, by column key: what the container starts
 * from and what a reset restores.
 */
export const declaredWidths = <T>(
  columns: DataTableColumn<T>[],
): Record<string, number> =>
  Object.fromEntries(
    columns.flatMap((c) =>
      c.width === undefined ? [] : [[String(c.key), c.width]],
    ),
  );

/**
 * Builds the initial state container from config defaults. The result is a
 * plain object. Wrap it in a reactive proxy to track reads and writes.
 */
export const createTableState = <T>(config: Config<T>): State<T> => ({
  data: [],
  loading: false,
  initialized: false,
  page: 1,
  pageSize: TABLE_DEFAULT_PAGE_SIZE,
  total: 0,
  pageCount: 0,
  sortField: null,
  sortDirection: TABLE_DEFAULT_SORT_DIRECTION,
  selected: new Set(),
  columnOrder: (
    config.defaultColumnOrder ?? config.columns.map((c) => c.key)
  ).map(String),
  columnWidths: declaredWidths(config.columns),
  entries: [],
  draft: "",
});
