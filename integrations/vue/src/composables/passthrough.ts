import type { Passthrough, PassthroughSource } from "../types/passthrough";
import type { ComputedRef, MaybeRefOrGetter } from "vue";

import { computed, toValue } from "vue";
import { passthrough } from "../utils/passthrough";

/**
 * Resolves a component's part manifest into its reactive `settings`.
 * The consumer's `pt` layer wins per key over the local recipes.
 *
 * @param source - A reactive source of the `pt` layer and the local recipes.
 * @returns The resolved manifest, one entry per part.
 */
export const usePassthrough = <P, E = {}>(
  source: NoInfer<MaybeRefOrGetter<PassthroughSource<P, E>>>,
): ComputedRef<Passthrough<P, E>> => {
  return computed(() => {
    const { pt, recipes } = toValue(source);
    return passthrough<P, E>(pt, recipes);
  });
};
