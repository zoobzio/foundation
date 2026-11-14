import type { BrowserEmits } from "../types/components/browser";

/** The service events the browser relays as emits. Each is a declared emit. */
export const BROWSER_EVENTS = [
  "updated",
  "navigated",
  "filtered",
] as const satisfies readonly (keyof BrowserEmits<unknown>)[];

export const BROWSER_REFRESH_LABEL = "Refresh";
export const BROWSER_SORT_LABEL = "Sort";
export const BROWSER_ACTIONS_LABEL = "Actions";
export const BROWSER_EMPTY_TEXT = "Empty folder";
export const BROWSER_NO_FILES_TEXT = "No files";
export const BROWSER_CLEAR_SELECTION_LABEL = "Clear";
export const BROWSER_NO_MATCHES_TEXT = "No matches";

export const BROWSER_SEARCH_PLACEHOLDER = "Search...";
