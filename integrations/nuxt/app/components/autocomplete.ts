// The vue autocomplete with the layer's Scroller as its viewport, the
// `remove` icon on each chip, an option's icon (or `search` for a literal)
// before its label and an arrow after a field's, and its texts in the
// visitor's locale: the placeholder, and the empty, loading, and more
// states of its panel.
import type { QueryOption } from "@zoobzio/vue/types/components/autocomplete";
import type { Text } from "@zoobzio/kit";
import type { VNode } from "vue";

import Core from "@zoobzio/vue/components/autocomplete.vue";

import { icon, iconOf } from "./icon";
import { h } from "vue";
import { textIf, textIn } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Scroller from "./scroller";

const lead = (option: QueryOption): VNode[] =>
  iconOf(option.icon ?? (option.stage === "literal" ? "search" : undefined));

const arrow = (option: QueryOption): VNode[] => {
  if (option.stage === "value" || option.stage === "literal") return [];
  return [icon(option.active ? "expand" : "next")];
};

/**
 * A state of the panel, as the component's own default renders it, with
 * its text in the visitor's locale. A state that reports a lookup is a
 * status.
 */
const state = (value: Text, status?: boolean): VNode[] => [
  h(
    "div",
    { class: "f-group", role: status ? "status" : undefined },
    textIn("span", "f-span", value),
  ),
];

export default wrap(Core, {
  props: (props) => ({ ...props, placeholder: textIf(props.placeholder) }),
  pt: { viewport: { as: Scroller } },
  slots: {
    chipAppend: () => [icon("remove")],
    itemPrepend: ({ option }) => lead(option),
    itemArrow: ({ option }) => arrow(option),
    empty: ({ empty }) => (empty ? state("autocomplete.empty") : []),
    loading: () => state("autocomplete.loading", true),
    more: () => state("autocomplete.more", true),
  },
});
