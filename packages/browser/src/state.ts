import type { State } from "./types";

import { BROWSER_DEFAULT_SORT_DIRECTION } from "./constants";

/**
 * Builds the initial state container. The result is a plain object. Wrap it
 * in a reactive proxy to track reads and writes. The trail starts at the
 * root and sorting starts unset, so no config is needed.
 */
export const createBrowserState = <T>(): State<T> => ({
  folders: [],
  files: [],
  loading: false,
  initialized: false,
  path: [],
  sortField: null,
  sortDirection: BROWSER_DEFAULT_SORT_DIRECTION,
  selected: new Set(),
});
