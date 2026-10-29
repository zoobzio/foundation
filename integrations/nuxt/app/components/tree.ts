// The vue tree with NuxtLink under its `link` part and the `expand` icon as
// the toggle of each branch.
import Core from "@zoobzio/vue/components/tree.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { icon } from "./icon";

export default wrap(Core, {
  pt: { link: () => ({ as: NuxtLink }) },
  slots: {
    itemToggle: ({ item }) => (item.hasChildren ? [icon("expand")] : []),
  },
});
