import type { TableEmits } from "../types/components/table";
import type { RowData } from "@zoobzio/table";

/** The service events the table relays as emits. Each is a declared emit. */
export const TABLE_EVENTS = [
  "updated",
  "filtered",
] as const satisfies readonly (keyof TableEmits<RowData>)[];

export const TABLE_REFRESH_LABEL = "Refresh";
export const TABLE_COLUMNS_LABEL = "Columns";
export const TABLE_COLUMNS_GROUP_LABEL = "Columns";
export const TABLE_ACTIONS_LABEL = "Actions";
export const TABLE_EMPTY_TEXT = "No data";
export const TABLE_CLEAR_SELECTION_LABEL = "Clear";
export const TABLE_RESIZE_LABEL = "Resize";
export const TABLE_PIN_LABEL = "Pin";

/** The items of a column's pin menu, by the key each carries. */
export const TABLE_PIN_LABELS = {
  start: "Pin left",
  end: "Pin right",
  none: "Unpin",
} as const;

export const TABLE_COLUMNS_PLACEHOLDER = "Search columns...";
export const TABLE_SEARCH_PLACEHOLDER = "Search...";
