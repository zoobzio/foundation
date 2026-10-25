import type { State } from "./types";

import { CODE_ORIGIN } from "./constants";

/**
 * Builds the initial state container. The result is a plain object. Wrap
 * it in a reactive proxy to track reads and writes. The editor starts
 * empty, at revision zero, with the cursor at the origin and no element.
 */
export const createCodeState = (): State => ({
  revision: 0,
  empty: true,
  cursor: { ...CODE_ORIGIN },
  mounted: false,
});
