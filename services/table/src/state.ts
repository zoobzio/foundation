import type { Config, RowData, State } from "./types";

import { getInitialTableState } from "@tanstack/table-core";
import { createSyncState } from "@zoobzio/sync";
import { features } from "./features";

/**
 * Builds the initial state container: each slice of the TanStack table at
 * its default, under the config's `initialState`, an empty page, the
 * query's clauses, and the sync's interval. The result is a plain object. Wrap it in a reactive
 * proxy to track reads and writes.
 */
export const createTableState = <T extends RowData>(
  config: Config<T>,
): State<T> => {
  // The progress of a resize is the table's own: it is not a slice of the
  // container.
  const { columnResizing: _r, ...slices } = getInitialTableState(
    features,
    config.initialState,
  );
  return {
    ...slices,
    data: [],
    rowCount: 0,
    loading: false,
    initialized: false,
    clauses: config.initialClauses ?? [],
    draft: "",
    suggest: { options: [], status: "idle", more: false },
    ...createSyncState(config.sync),
  };
};
