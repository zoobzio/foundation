import { computed, toValue, type MaybeRefOrGetter } from "#imports";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
import { passthrough } from "#foundation/utils/passthrough";

export function usePassthrough<P, E = {}>(
  userPT: MaybeRefOrGetter<Passthrough<P, E> | undefined>,
  localPT: MaybeRefOrGetter<Recipe<P, E>>,
) {
  return computed(() => passthrough(toValue(userPT), toValue(localPT)));
}

export function useItemPassthrough<T, P, E = {}>(
  items: MaybeRefOrGetter<T[]>,
  userPT: MaybeRefOrGetter<Passthrough<P, E> | undefined>,
  localPT: (item: T) => Recipe<P, E>,
) {
  return computed(() =>
    toValue(items).map((item) => ({
      item,
      pt: passthrough(toValue(userPT), localPT(item)),
    })),
  );
}
