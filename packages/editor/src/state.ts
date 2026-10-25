import type { State } from "./types";

/**
 * Builds the initial state container. The result is a plain object. Wrap
 * it in a reactive proxy to track reads and writes. The editor starts
 * empty, at revision zero, with nothing active and no element.
 */
export const createEditorState = (): State => ({
  revision: 0,
  empty: true,
  active: {},
  mounted: false,
});
