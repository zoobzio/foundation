// The vue accordion with an item's `icon` before its label, the `expand`
// icon after it, and each label in the visitor's locale.
import Core from "@zoobzio/vue/components/accordion.vue";

import { icon, iconOf } from "./icon";
import { textSlot } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: {
    triggerPrepend: ({ item }) => iconOf(item.icon),
    triggerLabel: ({ item }) => textSlot(item.label),
    triggerAppend: () => [icon("expand")],
  },
});
