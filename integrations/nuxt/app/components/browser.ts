// The vue browser with the layer's parts behind its own: the layer's
// Breadcrumb as its trail, NuxtLink under the files' `link`, the layer's
// Menu for file and folder actions (so an action's `icon` draws), the
// layer's Checkbox for the row checkboxes. Its Fab slots draw the `refresh`
// and `actions` icons, a folder draws `folder` before its name, a bulk
// action its own `icon`. Its own text — the refresh and actions labels, the
// empty states, the clear button — reads in the visitor's locale, and a
// date, number, currency, file size or boolean cell formats through the
// app's prosary service.
import type {
  BrowserFileCellContext,
  BrowserFilesPassthrough,
} from "@zoobzio/vue/types/components/browser-files";
import type { BrowserFoldersPassthrough } from "@zoobzio/vue/types/components/browser-folders";

import Core from "@zoobzio/vue/components/browser.vue";

import NuxtLink from "#app/components/nuxt-link";
import { h } from "vue";
import { layer } from "@zoobzio/vue/utils/passthrough";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Breadcrumb from "./breadcrumb";
import Checkbox from "./checkbox";
import Menu from "./menu";
import { icon, iconOf, iconPart } from "./icon";
import { cellSlots } from "./cell";
import { text, textSlot } from "./text";

export default wrap(Core, {
  pt: (pt) => ({
    ...pt,
    breadcrumb: { as: Breadcrumb, ...pt?.breadcrumb },
    refresh: { label: text("browser.refresh"), ...pt?.refresh },
    files: layer<BrowserFilesPassthrough<unknown>>(pt?.files, {
      link: () => ({ as: NuxtLink }),
      rowCheckbox: { as: Checkbox },
      actionsTrigger: { label: text("browser.actions") },
      actionsMenu: { as: Menu },
    }),
    folders: layer<BrowserFoldersPassthrough>(pt?.folders, {
      actionsTrigger: { label: text("browser.actions") },
      actionsMenu: { as: Menu },
    }),
  }),
  slots: {
    ...cellSlots<BrowserFileCellContext<unknown>>(
      ({ browser }) => browser.currency,
    ),
    refresh: ({ settings }) => iconPart(settings.refresh, "refresh"),
    actions: ({ settings }) => iconPart(settings.actionsTrigger, "actions"),
    folderActions: ({ settings }) =>
      iconPart(settings.actionsTrigger, "actions"),
    folderPrepend: () => [icon("folder")],
    bulkActionPrepend: ({ action }) => iconOf(action.icon),
    bulkClear: () => textSlot("browser.clear"),
    empty: () => [
      h(
        "div",
        { class: "f-group f-data-browser-empty" },
        text("browser.empty"),
      ),
    ],
    noFiles: () => textSlot("browser.noFiles"),
  },
});
