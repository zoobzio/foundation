import type { StateKey } from "./types";

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const QUERY_STATE_FIELDS: Record<StateKey, null> = {
  entries: null,
  draft: null,
};
