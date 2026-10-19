import type { BrowserFoldersSlots } from "../types/data/browser/folders";
import type { SortDirection } from "../types/data/table";

export const BROWSER_DEFAULT_SORT_DIRECTION: SortDirection = "asc";

export const BROWSER_REFRESH_LABEL = "Refresh";
export const BROWSER_ACTIONS_LABEL = "Actions";

export const BROWSER_ROOT_KEY = "";
export const BROWSER_ROOT_LABEL = "Home";

/**
 * Folder slots the widget relays to the folder rows section — all share the
 * folder-scoped ctx. The item-scoped `folderActionIcon` is relayed explicitly.
 */
export const BROWSER_FOLDER_SLOTS = [
  "folder",
  "folderIcon",
  "folderLabel",
  "folderActionsIcon",
] as const satisfies readonly (keyof BrowserFoldersSlots<unknown>)[];
