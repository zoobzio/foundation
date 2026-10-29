// The vue table with NuxtLink under the `link` part of its body, which is
// a nested manifest (`pt.body`) and so is layered where it sits.
import type { TableBodyPassthrough } from "@zoobzio/vue/types/components/table-body";

import Core from "@zoobzio/vue/components/table.vue";

import NuxtLink from "#app/components/nuxt-link";
import { layer } from "@zoobzio/vue/utils/passthrough";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  pt: (pt) => ({
    ...pt,
    body: layer<TableBodyPassthrough<unknown>>(pt?.body, {
      link: () => ({ as: NuxtLink }),
    }),
  }),
});
