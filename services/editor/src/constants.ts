import type { StateKey } from "./types";
import type { JSONContent } from "@tiptap/core";

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const EDITOR_STATE_FIELDS: Record<StateKey, null> = {
  revision: null,
  empty: null,
  active: null,
  mounted: null,
};

/** The node a block toggles back to. */
export const EDITOR_BLOCK_FALLBACK = "paragraph";

/** The item node of every list the feature set offers. */
export const EDITOR_LIST_ITEM = "listItem";

/**
 * The document a fresh editor holds: one empty paragraph, as JSON. JSON,
 * not HTML, so the editor builds its document with no DOM.
 */
export const EDITOR_EMPTY_DOCUMENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};
