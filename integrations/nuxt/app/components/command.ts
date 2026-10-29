// The vue command with the `search` icon before its filter, an item's
// `icon` before its label, the layer's Checkbox rendering each item's
// checkbox, and the layer's Scroller as its viewport.
import Core from "@zoobzio/vue/components/command.vue";

import { icon, iconOf } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Checkbox from "./checkbox";
import Scroller from "./scroller";

export default wrap(Core, {
  pt: {
    viewport: { as: Scroller },
    itemCheckbox: () => ({ as: Checkbox }),
  },
  slots: {
    inputPrepend: () => [icon("search")],
    itemPrepend: ({ item }) => iconOf(item.icon),
  },
});
