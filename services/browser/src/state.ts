import type { Config, State } from "./types";

import { createSyncState } from "@zoobzio/sync";
import { BROWSER_DEFAULT_SORT_DIRECTION } from "./constants";

/**
 * Builds the initial state container. The result is a plain object. Wrap it
 * in a reactive proxy to track reads and writes. The trail starts at the
 * root and sorting starts unset, so no config is needed: its `sync`, where
 * given, sets the interval the sync starts on.
 */
export const createBrowserState = <T>(
  config: Pick<Config<T>, "sync"> = {},
): State<T> => ({
  folders: [],
  files: [],
  loading: false,
  initialized: false,
  path: [],
  sortField: null,
  sortDirection: BROWSER_DEFAULT_SORT_DIRECTION,
  selected: new Set(),
  selectedFolders: new Set(),
  clauses: [],
  draft: "",
  suggest: { options: [], status: "idle", more: false },
  ...createSyncState(config.sync),
});
