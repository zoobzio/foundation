// The vue breadcrumb with NuxtLink under its `link` part and an item's
// `icon` drawn before its label.
import Core from "@zoobzio/vue/components/breadcrumb.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";
import { iconOf } from "./icon";

export default wrap(Core, {
  pt: { link: () => ({ as: NuxtLink }) },
  slots: { itemPrepend: ({ item }) => iconOf(item.icon) },
});
