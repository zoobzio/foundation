import type { Cursor, StateKey } from "./types";

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const CODE_STATE_FIELDS: Record<StateKey, null> = {
  revision: null,
  empty: null,
  cursor: null,
  mounted: null,
};

/** The document a fresh editor holds: no text. */
export const CODE_EMPTY_DOCUMENT = "";

/** The cursor of an empty document: the first column of the first line. */
export const CODE_ORIGIN: Cursor = { line: 1, column: 1 };
