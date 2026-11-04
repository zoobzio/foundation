import type { StateKey } from "./types";

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const FORM_STATE_FIELDS: Record<StateKey, null> = {
  initialized: null,
  payload: null,
  errors: null,
  touched: null,
  submitting: null,
  submitted: null,
};
