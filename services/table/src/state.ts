import type { Config, RowData, State } from "./types";

import { getInitialTableState } from "@tanstack/table-core";
import { features } from "./features";

/**
 * Builds the initial state container: each slice of the TanStack table at
 * its default, under the config's `initialState`, an empty page, and the
 * query's entries. The result is a plain object. Wrap it in a reactive
 * proxy to track reads and writes.
 */
export const createTableState = <T extends RowData>(
  config: Config<T>,
): State<T> => ({
  ...getInitialTableState(features, config.initialState),
  data: [],
  rowCount: 0,
  loading: false,
  initialized: false,
  entries: config.initialEntries ?? [],
  draft: "",
  suggest: { options: [], status: "idle", more: false },
});
