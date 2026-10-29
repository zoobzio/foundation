import type { AnyForward } from "../types/forward";
import type { VNode } from "vue";

import { h } from "vue";

/**
 * Renders one forward: the component with its current props and the slot
 * record passed whole. A per-datum forward maps the datum to the props; a
 * static one ignores it. A part forward names no component: the getter's
 * `as` is the component and the rest its props. The entry's component is
 * checked against its props where the entry is authored (`Forward`,
 * `ForwardIter`), so the renderer takes the erased shape.
 */
export const forward = (entry: AnyForward, datum?: object): VNode => {
  if (entry.component)
    return h(entry.component, entry.props(datum), entry.slots);
  const { as, ...props } = entry.props(datum);
  return h(as, props, entry.slots);
};
