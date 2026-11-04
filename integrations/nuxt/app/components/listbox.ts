// The vue listbox with each item's label in the visitor's locale.
import Core from "@zoobzio/vue/components/listbox.vue";

import { textSlot } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: { itemLabel: ({ item }) => textSlot(item.label) },
});
