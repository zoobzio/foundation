import type { StateKey } from "./types";

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const VIEWS_STATE_FIELDS: Record<StateKey, null> = {
  views: null,
  stale: null,
  active: null,
  pending: null,
  loading: null,
  saving: null,
  initialized: null,
};
