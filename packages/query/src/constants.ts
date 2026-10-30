import type { StateKey } from "./types";

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const QUERY_STATE_FIELDS: Record<StateKey, null> = {
  entries: null,
  draft: null,
};

/**
 * The quote that opens free text in the draft, and closes it: a draft that
 * starts with it is the text stage, and a second one commits the text.
 */
export const QUERY_TEXT_QUOTE = '"';

/** The label of the text option when the config names none. */
export const QUERY_TEXT_LABEL = "Search";
