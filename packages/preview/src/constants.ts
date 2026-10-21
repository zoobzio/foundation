import type { StateKey } from "./types";

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const PREVIEW_STATE_FIELDS: Record<StateKey, null> = {
  initialized: null,
  loading: null,
  data: null,
};
