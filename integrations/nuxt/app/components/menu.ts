// The vue menu with NuxtLink under its `link` part, and an item's `icon`
// (the field app.d.ts adds to MenuItem) drawn in the `itemPrepend` slot
// unless the consumer renders that slot itself.
import Core from "@zoobzio/vue/components/menu.vue";

import NuxtLink from "#app/components/nuxt-link";
import { Icon } from "#components";
import { h } from "vue";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  pt: { link: () => ({ as: NuxtLink }) },
  slots: {
    itemPrepend: ({ item }) =>
      item.icon ? [h(Icon, { name: item.icon })] : [],
  },
});
