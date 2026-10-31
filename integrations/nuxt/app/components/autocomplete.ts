// The vue autocomplete with the layer's Scroller as the viewport of its
// first panel (the active panel renders with no scroller once a group has
// an option set), the `remove` icon after each chip's label (the chip is the
// button that removes its entry), an option's `icon` before its label, with
// `search` before a literal option that names none (a literal is a value
// typed between its own characters, free text in quotes by default), and
// an arrow after an option that branches: `next` on a field or operator
// option, as selecting it enters a stage, and `expand` on an active trail
// option, as its stage is the one open. A value option commits and a
// literal option is terminal, so neither draws an arrow.
import type { QueryOption } from "@zoobzio/vue/types/components/autocomplete";
import type { VNode } from "vue";

import Core from "@zoobzio/vue/components/autocomplete.vue";

import { icon, iconOf } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Scroller from "./scroller";

const lead = (option: QueryOption): VNode[] =>
  iconOf(option.icon ?? (option.stage === "literal" ? "search" : undefined));

const arrow = (option: QueryOption): VNode[] => {
  if (option.stage === "value" || option.stage === "literal") return [];
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
