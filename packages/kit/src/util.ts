import type { Changes } from "./types";

/**
 * Builds the change object of a field.
 */
export const change = <S, K extends keyof S>(
  field: K,
  before: S[K],
  after: S[K],
): Changes<S>[K] => ({ field, before, after });
