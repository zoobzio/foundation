// data/table constants

import type { IconAlias } from "../types/common/icon";
import type { SortDirection } from "../types/data/table";

export const TABLE_DEFAULT_PAGE_SIZE = 25;
export const TABLE_DEFAULT_SORT_DIRECTION: SortDirection = "asc";

export const TABLE_SORT_ASC_ICON: IconAlias = "chevron-up";
export const TABLE_SORT_DESC_ICON: IconAlias = "chevron-down";
export const TABLE_DRAG_ICON: IconAlias = "drag";
export const TABLE_COLUMNS_ICON: IconAlias = "settings";
export const TABLE_ACTIONS_ICON: IconAlias = "actions";
export const TABLE_REFRESH_ICON: IconAlias = "refresh";

export const TABLE_COLUMNS_PLACEHOLDER = "Search columns...";
export const TABLE_SEARCH_PLACEHOLDER = "Search...";

export const TABLE_DATE_OPERATORS = ["before", "after", "on"] as const;
export const TABLE_NUMBER_OPERATORS = ["over", "under", "is"] as const;

export const TABLE_SEARCH_LOOKAHEAD = 20;
export const TABLE_SEARCH_LOOKAHEAD_MAX_DEPTH = 50;
