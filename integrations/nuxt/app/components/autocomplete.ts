// The vue autocomplete with the layer's Scroller as the viewport of its
// active panel, the `remove` icon after each chip's label (the chip is the
// button that removes its entry), an option's `icon` before its label, and
// an arrow after an option that branches: `next` on a field or operator
// option, as selecting it enters a stage, and `expand` on an active trail
// option, as its stage is the one open. A value option commits, so it
// draws no arrow.
import type { QueryOption } from "@zoobzio/vue/types/components/autocomplete";
import type { VNode } from "vue";

import Core from "@zoobzio/vue/components/autocomplete.vue";

import { icon, iconOf } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Scroller from "./scroller";

const arrow = (option: QueryOption): VNode[] => {
  if (option.stage === "value") return [];
  return [icon(option.active ? "expand" : "next")];
};

export default wrap(Core, {
  pt: { viewport: { as: Scroller } },
  slots: {
    chipAppend: () => [icon("remove")],
    itemPrepend: ({ option }) => iconOf(option.icon),
    itemArrow: ({ option }) => arrow(option),
  },
});
