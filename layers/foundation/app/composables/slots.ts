import type { ComputedRef } from "vue";

import { computed } from "#imports";

/**
 * Filters a parent's slot names down to the ones the consumer actually
 * provided, for relaying to a child.
 *
 * The slot half of a renderer widget: a parent that dispatches config to a
 * child (form → field, table → cell) relays its own slots so consumers can
 * override the child's internals from the top. Only provided slots may be
 * forwarded — defining every child slot unconditionally would override the
 * child's defaults with nothing.
 *
 * @param slots - The parent's `defineSlots` return.
 * @param names - The child's slot names, as declared by the parent's manifest.
 * @returns The provided subset, ready for a dynamic-slot `v-for`.
 */
export const useForwardSlots = <S extends object, K extends keyof S>(
  slots: S,
  names: readonly K[],
): ComputedRef<K[]> => {
  return computed(() => names.filter((name) => !!slots[name]));
};
