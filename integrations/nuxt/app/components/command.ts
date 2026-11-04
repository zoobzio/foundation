// The vue command with the `search` icon before its filter, an item's
// `icon` before its label, the layer's Checkbox rendering each item's
// checkbox, the layer's Scroller as its viewport, and its text — the
// groups, the options, the placeholder, the empty state — resolved.
import Core from "@zoobzio/vue/components/command.vue";

import { icon, iconOf } from "./icon";
import { textOr, textSlot, texts } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Checkbox from "./checkbox";
import Scroller from "./scroller";

export default wrap(Core, {
  props: (props) => ({
    ...props,
    groups: texts(props.groups),
    modelValue: texts(props.modelValue),
    placeholder: textOr(props.placeholder, "command.placeholder"),
  }),
  pt: {
    viewport: { as: Scroller },
    itemCheckbox: () => ({ as: Checkbox }),
  },
  slots: {
    inputPrepend: () => [icon("search")],
    itemPrepend: ({ item }) => iconOf(item.icon),
    empty: () => textSlot("command.empty"),
  },
});
