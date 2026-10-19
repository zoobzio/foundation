import type { State, StateKey } from "./types";

import { DECK_SORT_LABELS } from "./constants";

export const change = <T>(
  field: StateKey,
  before: State<T>[StateKey],
  after: State<T>[StateKey],
) => ({ field, before, after });

/** The title label of a sort field: a known label, else capitalized. */
export const sortLabel = (field: string): string =>
  DECK_SORT_LABELS[field] ?? field.charAt(0).toUpperCase() + field.slice(1);
