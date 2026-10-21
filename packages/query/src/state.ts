import type { State } from "./types";

/**
 * Builds the initial state container. The result is a plain object. Wrap
 * it in a reactive proxy to track reads and writes.
 */
export const createQueryState = (): State => ({
  entries: [],
  draft: "",
});
