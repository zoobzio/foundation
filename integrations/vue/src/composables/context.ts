import type { Context } from "../types/context";
import type { ComputedRef, MaybeRefOrGetter } from "vue";

import { computed, toValue } from "vue";

/**
 * Wraps a component's view model as its context.
 *
 * @param name - The component's identity. The context carries it as `id`.
 * @param source - A reactive source of the view model.
 * @returns The computed context for `defineExpose` and the ctx-scoped slots.
 */
export const useContext = <Ctx extends object>(
  name: string,
  source: NoInfer<MaybeRefOrGetter<Ctx>>,
): ComputedRef<Context<Ctx>> => {
  return computed(() => ({
    id: name,
    ...toValue(source),
  }));
};
