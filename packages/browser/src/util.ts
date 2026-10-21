import type { BrowserFolder } from "./types";

/** A copy of the folders in alphabetical label order. */
export const sortFolders = (folders: BrowserFolder[]): BrowserFolder[] =>
  [...folders].sort((a, b) => a.label.localeCompare(b.label));
