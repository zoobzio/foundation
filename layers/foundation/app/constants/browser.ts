// data/browser constants — domain values come from the headless package; the
// view-only values (labels, root crumb, slots) live here.

import type { BrowserFoldersSlots } from "../types/data/browser/folders";

export { BROWSER_DEFAULT_SORT_DIRECTION } from "@zoobzio/browser";

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
