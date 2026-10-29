// The vue browser with the layer's parts behind its own: the layer's
// Breadcrumb for the trail, the layer's Menu for file and folder actions
// (so an action's `icon` draws), the layer's Checkbox for the file
// checkboxes, and NuxtLink under the `link` part of its files. Its Fab
// slots draw the `refresh` and `actions` icons; a folder draws `folder`
// before its name; a bulk action draws its own `icon`.
import type { BrowserFilesPassthrough } from "@zoobzio/vue/types/components/browser-files";
import type { BrowserFoldersPassthrough } from "@zoobzio/vue/types/components/browser-folders";

import Core from "@zoobzio/vue/components/browser.vue";

import NuxtLink from "#app/components/nuxt-link";
import { layer } from "@zoobzio/vue/utils/passthrough";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Breadcrumb from "./breadcrumb";
import Checkbox from "./checkbox";
import Menu from "./menu";
import { icon, iconOf, iconPart } from "./icon";

export default wrap(Core, {
  pt: (pt) => ({
    ...pt,
    breadcrumb: { as: Breadcrumb, ...pt?.breadcrumb },
    files: layer<BrowserFilesPassthrough<unknown>>(pt?.files, {
      link: () => ({ as: NuxtLink }),
      rowCheckbox: { as: Checkbox },
      actionsMenu: { as: Menu },
    }),
    folders: layer<BrowserFoldersPassthrough>(pt?.folders, {
      actionsMenu: { as: Menu },
    }),
  }),
  slots: {
    refresh: ({ settings }) => iconPart(settings.refresh, "refresh"),
    actions: ({ settings }) => iconPart(settings.actionsTrigger, "actions"),
    folderActions: ({ settings }) =>
      iconPart(settings.actionsTrigger, "actions"),
    folderPrepend: () => [icon("folder")],
    bulkActionPrepend: ({ action }) => iconOf(action.icon),
  },
});
