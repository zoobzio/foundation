// The vue tree with NuxtLink under its `link` part, `expand` as the toggle
// of a node with children, and each node's label in the visitor's locale.
import Core from "@zoobzio/vue/components/tree.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { icon } from "./icon";
import { textSlot } from "./text";

export default wrap(Core, {
  pt: { link: () => ({ as: NuxtLink }) },
  slots: {
    itemToggle: ({ item }) => (item.hasChildren ? [icon("expand")] : []),
    itemText: ({ item }) => textSlot(item.value.label),
  },
});
