// The vue browser with NuxtLink under the `link` parts of its files and of
// its breadcrumb trail, both nested manifests (`pt.files`,
// `pt.breadcrumb.pt`) and so layered where they sit.
import type { BreadcrumbPassthrough } from "@zoobzio/vue/types/components/breadcrumb";
import type { BrowserCrumbItem } from "@zoobzio/vue/types/components/browser";
import type { BrowserFilesPassthrough } from "@zoobzio/vue/types/components/browser-files";

import Core from "@zoobzio/vue/components/browser.vue";

import NuxtLink from "#app/components/nuxt-link";
import { layer } from "@zoobzio/vue/utils/passthrough";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  pt: (pt) => ({
    ...pt,
    files: layer<BrowserFilesPassthrough<unknown>>(pt?.files, {
      link: () => ({ as: NuxtLink }),
    }),
    breadcrumb: {
      ...pt?.breadcrumb,
      pt: layer<BreadcrumbPassthrough<BrowserCrumbItem>>(pt?.breadcrumb?.pt, {
        link: () => ({ as: NuxtLink }),
      }),
    },
  }),
});
