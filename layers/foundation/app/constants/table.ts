// data/table constants — domain values come from the headless package; the
// view-only values (labels, placeholders, lookahead) live here.

import type { TableHeadSlots } from "../types/data/table/head";

export {
  TABLE_DATE_OPERATORS,
  TABLE_DEFAULT_PAGE_SIZE,
  TABLE_DEFAULT_SORT_DIRECTION,
  TABLE_NUMBER_OPERATORS,
} from "@zoobzio/table";

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

export const TABLE_SEARCH_LOOKAHEAD = 20;
export const TABLE_SEARCH_LOOKAHEAD_MAX_DEPTH = 50;
