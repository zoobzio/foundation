import type { BrowserFolder, State, StateKey } from "./types";

export const change = <T>(
  field: StateKey,
  before: State<T>[StateKey],
  after: State<T>[StateKey],
) => ({ field, before, after });

/** A copy of the folders in alphabetical label order. */
export const sortFolders = (folders: BrowserFolder[]): BrowserFolder[] =>
  [...folders].sort((a, b) => a.label.localeCompare(b.label));
