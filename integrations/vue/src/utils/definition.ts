import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { computed, isRef, toValue } from "vue";

/**
 * The runtime behind each `define*`. A plain definition returns as is.
 * A ref or getter returns a computed over its source.
 */
export const define = <D extends object>(
  definition: D | DefinitionSource<D>,
): D | ComputedRef<D> =>
  isRef(definition) || typeof definition === "function"
    ? computed(() => toValue(definition))
    : definition;
