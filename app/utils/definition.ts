import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { computed, isRef, toValue } from "#imports";

/**
 * The runtime behind every composite `define*`: a plain definition passes
 * through untouched (identity — pure data, no Vue), a ref or getter becomes
 * a computed over its source. A definition is always an object, never a
 * function, so the source's shape discriminates the two.
 */
export const define = <D extends object>(
  definition: D | DefinitionSource<D>,
): D | ComputedRef<D> =>
  isRef(definition) || typeof definition === "function"
    ? computed(() => toValue(definition))
    : definition;
