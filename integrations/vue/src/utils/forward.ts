import type { Forward } from "../types/forward";
import type { Component, VNode } from "vue";

import { h } from "vue";

/**
 * Renders one forward: the component with its current props and the slot
 * record passed whole. The entry's component is checked against its props
 * in the type. `h` takes the erased `Component`.
 */
export const forward = <P extends object>(entry: Forward<P>): VNode => {
  const component: Component = entry.component;
  return h(component, entry.props(), entry.slots);
};
