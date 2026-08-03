import type { Context } from "#foundation/types/context";
import type { ComputedRef, MaybeRefOrGetter } from "vue";

import { computed, toValue } from "#imports";

/**
 * Wraps a component's view model as its addressable context.
 *
 * The reactive sibling of `useBindings`/`usePassthrough`: one source in, the
 * ctx computed out. `name` identifies the component to the system and is
 * inherited by the context as `id`. This is the entry point for system-level
 * capabilities — registration, lifecycle tracking, instrumentation — in later
 * iterations; every component is already wired through it.
 *
 * @param name - The component's system identity (registry key or tier name).
 * @param source - Reactive source of the component's view model.
 * @returns The ctx computed served to both expose and slots.
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
