import type {
  Passthrough,
  PassthroughLayer,
  PassthroughSource,
  PT,
} from "../types/passthrough";
import type { ComputedRef, MaybeRefOrGetter } from "vue";

import { computed, toValue } from "vue";
import { layer, passthrough } from "../utils/passthrough";

/**
 * Resolves a component's part manifest into its reactive `settings`.
 * The consumer's `pt` layer wins per key over the local recipes.
 *
 * @param source - A reactive source of the `pt` layer and the local recipes.
 * @returns The resolved manifest, one entry per part.
 */
export function usePassthrough<P, E = {}>(
  source: NoInfer<MaybeRefOrGetter<PassthroughSource<P, E>>>,
): ComputedRef<Passthrough<P, E>>;
/**
 * Lays a wrapper's partial manifest under the consumer's `pt`. The
 * consumer's layer wins per key; a function part composes with the
 * wrapper's. The result stays partial, for the wrapped component's `pt`.
 *
 * @param source - A reactive source of the `pt` layer and the wrapper's.
 * @returns The layered partial manifest.
 */
export function usePassthrough<P, E = {}>(
  source: NoInfer<MaybeRefOrGetter<PassthroughLayer<P, E>>>,
): ComputedRef<PT<Passthrough<P, E>>>;
export function usePassthrough<P, E = {}>(
  source: MaybeRefOrGetter<PassthroughSource<P, E> | PassthroughLayer<P, E>>,
): ComputedRef<Passthrough<P, E> | PT<Passthrough<P, E>>> {
  return computed(() => {
    const value = toValue(source);
    return "recipes" in value
      ? passthrough<P, E>(value.pt, value.recipes)
      : layer<P, E>(value.pt, value.layer);
  });
}
