import type { Literal, StateKey } from "./types";

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const QUERY_STATE_FIELDS: Record<StateKey, null> = {
  entries: null,
  draft: null,
};

/** The key of the text literal, the one `text` reads. */
export const QUERY_TEXT_KEY = "text";

/**
 * The text literal: free text between quotes, under `Search`. A draft that
 * opens with the quote is the literal, and a second one commits it.
 */
export const QUERY_TEXT_LITERAL: Literal = {
  label: "Search",
  open: '"',
  close: '"',
};

/** The literals of a config that names none: the text literal alone. */
export const QUERY_LITERALS: Record<string, Literal> = {
  [QUERY_TEXT_KEY]: QUERY_TEXT_LITERAL,
};

/**
 * The most days `dateValues` lists: the recent window an empty term looks
 * back over, and the cap on a term that names a whole year.
 */
export const QUERY_DATE_VALUES_LIMIT = 31;
