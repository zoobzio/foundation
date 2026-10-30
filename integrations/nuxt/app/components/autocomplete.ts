// The vue autocomplete with the layer's Scroller as the viewport of its
// first panel (the active panel renders with no scroller once a group has
// an option set), the `remove` icon after each chip's label (the chip is the
// button that removes its entry), an option's `icon` before its label, the
// `search` icon before the text option (the one that opens the quote free
// text is typed in), and an arrow after an option that branches: `next` on
// a field, operator or text option, as selecting it enters a stage, and
// `expand` on an active trail option, as its stage is the one open. A value
// option commits, so it draws no arrow.
import type { QueryOption } from "@zoobzio/vue/types/components/autocomplete";
import type { VNode } from "vue";

import Core from "@zoobzio/vue/components/autocomplete.vue";

import { icon, iconOf } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Scroller from "./scroller";

const lead = (option: QueryOption): VNode[] =>
  option.stage === "text" ? [icon("search")] : iconOf(option.icon);

const arrow = (option: QueryOption): VNode[] => {
  if (option.stage === "value") return [];
  return [icon(option.active ? "expand" : "next")];
};

export default wrap(Core, {
  pt: { viewport: { as: Scroller } },
  slots: {
    chipAppend: () => [icon("remove")],
    itemPrepend: ({ option }) => lead(option),
    itemArrow: ({ option }) => arrow(option),
  },
});
