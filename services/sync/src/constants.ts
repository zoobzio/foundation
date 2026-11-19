import type { StateKey } from "./types";

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const SYNC_STATE_FIELDS: Record<StateKey, null> = {
  interval: null,
  since: null,
  syncing: null,
};

/** The interval of a sync that does not poll. */
export const SYNC_OFF = 0;

/**
 * The intervals of a config that names none, in milliseconds: ten seconds,
 * thirty, a minute, five.
 */
export const SYNC_INTERVALS: readonly number[] = [
  10_000, 30_000, 60_000, 300_000,
];
