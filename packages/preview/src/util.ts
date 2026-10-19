import type { State, StateKey } from "./types";

export const change = <T>(
  field: StateKey,
  before: State<T>[StateKey],
  after: State<T>[StateKey],
) => ({ field, before, after });
