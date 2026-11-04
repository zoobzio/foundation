// The vue accordion with an item's `icon` before its label, the `expand`
// icon after it, and the items' text resolved.
import Core from "@zoobzio/vue/components/accordion.vue";

import { icon, iconOf } from "./icon";
import { texts } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  props: (props) => ({ ...props, items: texts(props.items) }),
  slots: {
    triggerPrepend: ({ item }) => iconOf(item.icon),
    triggerAppend: () => [icon("expand")],
  },
});
