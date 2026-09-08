import type { BrowserFoldersSlots } from "../types/data/browser/folders";
import type { SortDirection } from "../types/data/table";
import type { IconAlias } from "../types/icon";

export const BROWSER_DEFAULT_SORT_DIRECTION: SortDirection = "asc";

export const BROWSER_SORT_ASC_ICON: IconAlias = "chevron-up";
export const BROWSER_SORT_DESC_ICON: IconAlias = "chevron-down";
export const BROWSER_REFRESH_ICON: IconAlias = "refresh";
export const BROWSER_ACTIONS_ICON: IconAlias = "actions";
export const BROWSER_FOLDER_ICON: IconAlias = "folder";
export const BROWSER_FILE_ICON: IconAlias = "file";

export const BROWSER_ROOT_KEY = "";
export const BROWSER_ROOT_LABEL = "Home";
export const BROWSER_ROOT_ICON: IconAlias = "home";

/** Folder slots the widget relays to the folder rows section. */
export const BROWSER_FOLDER_SLOTS: (keyof BrowserFoldersSlots<unknown>)[] = [
  "folder",
  "folderIcon",
  "folderLabel",
];
