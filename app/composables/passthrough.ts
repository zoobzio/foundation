import type {
  Passthrough,
  PassthroughSource,
} from "#foundation/types/passthrough";
import type { ComputedRef, MaybeRefOrGetter } from "vue";

import { computed, toValue } from "#imports";
import { passthrough } from "#foundation/utils/passthrough";

/**
 * Resolves a component's part manifest into its reactive `settings`.
 *
 * A real composable: takes a single reactive source — the consumer's deep
 * partial `pt` layer plus the component's local `recipes` (which must satisfy
 * the full manifest) — and returns the computed the template binds part by
 * part. The user layer wins per key; `pt` may be omitted entirely.
 *
 * @param source - Reactive source of the `pt` layer and local recipes.
 * @returns The resolved part manifest, one entry per part.
 */
export const usePassthrough = <P, E = {}>(
  source: NoInfer<MaybeRefOrGetter<PassthroughSource<P, E>>>,
): ComputedRef<Passthrough<P, E>> => {
  return computed(() => {
    const { pt, recipes } = toValue(source);
    return passthrough<P, E>(pt, recipes);
  });
};
