import type { ComputedRef } from "vue";

import { computed, getCurrentInstance, onBeforeUpdate, shallowRef } from "vue";
import { explicit } from "../utils/explicit";

/**
 * The props the consumer passed, for a wrapper to hand on whole. An absent
 * prop stays absent for the wrapped component. The vnode is not reactive,
 * so each update of the wrapper bumps a version the computed reads: a prop
 * that appears or disappears without a value change still re-projects.
 *
 * @param props - The wrapper's resolved props.
 * @returns The computed projection, typed as the props.
 */
export const useExplicit = <P extends object>(props: P): ComputedRef<P> => {
  const instance = getCurrentInstance();
  const version = shallowRef(0);
  onBeforeUpdate(() => {
    version.value++;
  });
  return computed(() => {
    void version.value;
    return explicit(props, instance?.vnode.props ?? null);
  });
};
