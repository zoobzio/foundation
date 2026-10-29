// The vue table with NuxtLink under the `link` part of its body, and the
// layer's Menu rendering its row actions, so action items navigate through
// NuxtLink and draw their icons. Both sit in the body's nested manifest
// (`pt.body`) and so are layered where they sit.
import type { TableBodyPassthrough } from "@zoobzio/vue/types/components/table-body";

import Core from "@zoobzio/vue/components/table.vue";

import NuxtLink from "#app/components/nuxt-link";
import { layer } from "@zoobzio/vue/utils/passthrough";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Menu from "./menu";

export default wrap(Core, {
  pt: (pt) => ({
    ...pt,
    body: layer<TableBodyPassthrough<unknown>>(pt?.body, {
      link: () => ({ as: NuxtLink }),
      actionsMenu: { as: Menu },
    }),
  }),
});
