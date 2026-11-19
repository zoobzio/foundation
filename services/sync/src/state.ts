import type { Config, State } from "./types";

import { SYNC_OFF } from "./constants";

/**
 * Builds the initial state container: the config's `interval`, off where
 * it names none, and nothing marked. The result is a plain object. Wrap it
 * in a reactive proxy to track reads and writes.
 */
export const createSyncState = (config: Config = {}): State => ({
  interval: config.interval ?? SYNC_OFF,
  since: null,
  syncing: false,
});
