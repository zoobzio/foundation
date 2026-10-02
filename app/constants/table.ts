// data/table constants

import type { SortDirection } from "../types/data/table";
import type { TableHeadSlots } from "../types/data/table/head";

export const TABLE_DEFAULT_PAGE_SIZE = 25;
export const TABLE_DEFAULT_SORT_DIRECTION: SortDirection = "asc";

export const TABLE_REFRESH_LABEL = "Refresh";
export const TABLE_COLUMNS_LABEL = "Columns";
export const TABLE_ACTIONS_LABEL = "Actions";

/** Per-column head slots the widget relays — all share the column-scoped head ctx. */
export const TABLE_HEAD_SLOTS: (keyof TableHeadSlots<unknown>)[] = [
  "header",
  "sortIcon",
  "dragIcon",
];

export const TABLE_COLUMNS_PLACEHOLDER = "Search columns...";
export const TABLE_SEARCH_PLACEHOLDER = "Search...";

export const TABLE_DATE_OPERATORS = ["before", "after", "on"] as const;
export const TABLE_NUMBER_OPERATORS = ["over", "under", "is"] as const;

export const TABLE_SEARCH_LOOKAHEAD = 20;
export const TABLE_SEARCH_LOOKAHEAD_MAX_DEPTH = 50;
