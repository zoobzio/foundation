// The vue autocomplete with the layer's Scroller as its viewport, the
// `remove` icon on each chip, an option's icon (or `search` for a literal)
// before its label and an arrow after a field's, and its placeholder
// resolved.
import type { QueryOption } from "@zoobzio/vue/types/components/autocomplete";
import type { VNode } from "vue";

import Core from "@zoobzio/vue/components/autocomplete.vue";

import { icon, iconOf } from "./icon";
import { textIf } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Scroller from "./scroller";

const lead = (option: QueryOption): VNode[] =>
  iconOf(option.icon ?? (option.stage === "literal" ? "search" : undefined));

const arrow = (option: QueryOption): VNode[] => {
  if (option.stage === "value" || option.stage === "literal") return [];
  return [icon(option.active ? "expand" : "next")];
};

export default wrap(Core, {
  props: (props) => ({ ...props, placeholder: textIf(props.placeholder) }),
  pt: { viewport: { as: Scroller } },
  slots: {
    chipAppend: () => [icon("remove")],
    itemPrepend: ({ option }) => lead(option),
    itemArrow: ({ option }) => arrow(option),
  },
});
