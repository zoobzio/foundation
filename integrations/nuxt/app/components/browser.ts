// The vue browser with the layer's Breadcrumb rendering its trail and the
// layer's Menu rendering its file and folder actions, so crumbs and action
// items navigate through NuxtLink and draw their icons, and NuxtLink under
// the `link` part of its files. The file and folder parts are nested
// manifests (`pt.files`, `pt.folders`) and so are layered where they sit.
import type { BrowserFilesPassthrough } from "@zoobzio/vue/types/components/browser-files";
import type { BrowserFoldersPassthrough } from "@zoobzio/vue/types/components/browser-folders";

import Core from "@zoobzio/vue/components/browser.vue";

import NuxtLink from "#app/components/nuxt-link";
import { layer } from "@zoobzio/vue/utils/passthrough";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Breadcrumb from "./breadcrumb";
import Menu from "./menu";

export default wrap(Core, {
  pt: (pt) => ({
    ...pt,
    breadcrumb: { as: Breadcrumb, ...pt?.breadcrumb },
    files: layer<BrowserFilesPassthrough<unknown>>(pt?.files, {
      link: () => ({ as: NuxtLink }),
      actionsMenu: { as: Menu },
    }),
    folders: layer<BrowserFoldersPassthrough>(pt?.folders, {
      actionsMenu: { as: Menu },
    }),
  }),
});
