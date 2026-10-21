import type { TableEmits } from "../types/components/table";

/** The service events the table relays as emits. Each is a declared emit. */
export const TABLE_EVENTS = [
  "updated",
  "filtered",
] as const satisfies readonly (keyof TableEmits<unknown>)[];

export const TABLE_REFRESH_LABEL = "Refresh";
export const TABLE_COLUMNS_LABEL = "Columns";
export const TABLE_COLUMNS_GROUP_LABEL = "Columns";
export const TABLE_ACTIONS_LABEL = "Actions";
export const TABLE_EMPTY_TEXT = "No data";
export const TABLE_CLEAR_SELECTION_LABEL = "Clear";

export const TABLE_COLUMNS_PLACEHOLDER = "Search columns...";
export const TABLE_SEARCH_PLACEHOLDER = "Search...";
