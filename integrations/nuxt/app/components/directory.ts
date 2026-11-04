// The vue directory with NuxtLink under its `link` part, an item's `icon`
// before its label, and each group's and item's label in the visitor's
// locale.
import Core from "@zoobzio/vue/components/directory.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { iconOf } from "./icon";
import { textIn } from "./text";

export default wrap(Core, {
  pt: { link: () => ({ as: NuxtLink }) },
  slots: {
    groupLabel: ({ group }) =>
      group.label ? textIn("div", "f-caption", group.label) : [],
    itemPrepend: ({ item }) => iconOf(item.icon),
    itemLabel: ({ item }) => textIn("span", "f-span", item.label),
  },
});
