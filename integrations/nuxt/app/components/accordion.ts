// The vue accordion with an item's `icon` before its label and the
// `expand` icon after it.
import Core from "@zoobzio/vue/components/accordion.vue";

import { icon, iconOf } from "./icon";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: {
    triggerPrepend: ({ item }) => iconOf(item.icon),
    triggerAppend: () => [icon("expand")],
  },
});
