import type { AnyForward } from "../types/forward";
import type { VNode } from "vue";

import { h } from "vue";

/**
 * Renders one forward: the component with its current props and the slot
 * record passed whole. A per-datum forward maps the datum to the props; a
 * static one ignores it. The entry's component is checked against its
 * props where the entry is authored (`Forward`, `ForwardIter`), so the
 * renderer takes the erased shape.
 */
export const forward = (entry: AnyForward, datum?: object): VNode =>
  h(entry.component, entry.props(datum), entry.slots);
