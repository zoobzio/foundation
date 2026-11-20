import type { Config, RecordData, State } from "./types";

import { createSyncState } from "@zoobzio/sync";

/**
 * Builds the initial state container from config defaults. The result is
 * a plain object. Wrap it in a reactive proxy to track reads and writes.
 * The timeline starts with no records and no cursor, nothing selected,
 * the config's initial clauses, and the sync on the config's interval.
 */
export const createTimelineState = <T extends RecordData>(
  config: Config<T> = {},
): State<T> => ({
  records: [],
  cursor: null,
  loading: false,
  appending: false,
  initialized: false,
  selected: null,
  clauses: config.initialClauses ?? [],
  draft: "",
  suggest: { options: [], status: "idle", more: false },
  ...createSyncState(config.sync),
});
