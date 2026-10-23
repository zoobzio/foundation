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
export function useContext<Ctx extends object>(
  name: string,
  source: NoInfer<MaybeRefOrGetter<Ctx>>,
): ComputedRef<Context<Ctx>>;
/**
 * Forwards a wrapped component's context unchanged, for a wrapper's
 * `defineExpose`. It is `undefined` until the wrapped component mounts.
 *
 * @param source - A reactive source of the wrapped component's context.
 * @returns The computed context, as the wrapped component serves it.
 */
export function useContext<Ctx extends object>(
  source: MaybeRefOrGetter<Context<Ctx> | undefined>,
): ComputedRef<Context<Ctx> | undefined>;
export function useContext<Ctx extends object>(
  ...args:
    | [name: string, source: MaybeRefOrGetter<Ctx>]
    | [source: MaybeRefOrGetter<Context<Ctx> | undefined>]
): ComputedRef<Context<Ctx> | undefined> {
  if (args.length === 2) {
    const [name, source] = args;
    return computed(() => ({ id: name, ...toValue(source) }));
  }
  const [source] = args;
  return computed(() => toValue(source));
}
