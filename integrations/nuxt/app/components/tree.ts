// The vue tree with NuxtLink under its `link` part.
import Core from "@zoobzio/vue/components/tree.vue";

import NuxtLink from "#app/components/nuxt-link";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  pt: { link: () => ({ as: NuxtLink }) },
});
