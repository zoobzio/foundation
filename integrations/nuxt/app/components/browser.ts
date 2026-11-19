// The vue browser with the layer's parts behind its own: the layer's
// TableSearch as its search (the Autocomplete with the `magic` icon, the
// `/` key hint, and the `/` key focusing it), the layer's Menu for the sort
// options and for file and folder actions (so a column's or an action's
// `icon` draws), the layer's Breadcrumb as its trail, NuxtLink under the
// files' `link`, the layer's Checkbox for the file, folder and select-all
// checkboxes. Its Fab slots draw the `sort`, `refresh` and `actions`
// icons: the sort trigger draws `sort` until the files sort by a column,
// then `sort-asc` or `sort-desc`, which the column's item in the menu draws
// too. Where the browser has a sync, the menu behind the refresh is the
// layer's Menu, its items in the visitor's locale and `check` after the
// interval the sync is on. The root crumb draws `folder-open`, a crumb below it its own `icon`,
// a folder draws `folder` before its name, a bulk action its own `icon`.
// Its own text — the search's placeholder, the sort, refresh and actions
// labels, the listing's counts, the empty states, the clear button — reads
// in the visitor's locale, and a date, number, currency, file size or
// boolean cell, a file's or a folder's, formats through the app's prosary
// service, a date or a datetime in the browser's time zone.
import type {
  BrowserFileCellContext,
  BrowserFilesPassthrough,
} from "@zoobzio/vue/types/components/browser-files";
import type {
  BrowserFolderCellContext,
  BrowserFoldersPassthrough,
} from "@zoobzio/vue/types/components/browser-folders";
import type { BrowserHeadPassthrough } from "@zoobzio/vue/types/components/browser-head";
import type { Service } from "@zoobzio/browser";

import Core from "@zoobzio/vue/components/browser.vue";

import NuxtLink from "#app/components/nuxt-link";
import { layer } from "@zoobzio/vue/utils/passthrough";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Breadcrumb from "./breadcrumb";
import Checkbox from "./checkbox";
import Menu from "./menu";
import TableSearch from "./table-search";
import { icon, iconOf, iconPart } from "./icon";
import { cellSlots, folderCellSlots } from "./cell";
import { syncLabel, syncMark } from "./sync";
import { text, textSlot } from "./text";

// The direction the files sort in, as its icon.
const direction = (browser: Service<unknown>) =>
  browser.sortDirection === "asc" ? "sort-asc" : "sort-desc";

export default wrap(Core, {
  pt: (pt) => ({
    ...pt,
    search: {
      as: TableSearch,
      placeholder: text("browser.search"),
      ...pt?.search,
    },
    sortMenu: { as: Menu, ...pt?.sortMenu },
    sortTrigger: { label: text("browser.sort"), ...pt?.sortTrigger },
    head: layer<BrowserHeadPassthrough>(pt?.head, {
      breadcrumb: { as: Breadcrumb },
      selectAllCheckbox: { as: Checkbox },
    }),
    refresh: { label: text("browser.refresh"), ...pt?.refresh },
    syncMenu: { as: Menu, ...pt?.syncMenu },
    files: layer<BrowserFilesPassthrough<unknown>>(pt?.files, {
      link: () => ({ as: NuxtLink }),
      rowCheckbox: { as: Checkbox },
      actionsTrigger: { label: text("browser.actions") },
      actionsMenu: { as: Menu },
    }),
    folders: layer<BrowserFoldersPassthrough>(pt?.folders, {
      rowCheckbox: { as: Checkbox },
      actionsTrigger: { label: text("browser.actions") },
      actionsMenu: { as: Menu },
    }),
  }),
  slots: {
    ...cellSlots<BrowserFileCellContext<unknown>>(({ browser }) => browser),
    ...folderCellSlots<BrowserFolderCellContext<unknown>>(
      ({ browser }) => browser,
    ),
    sort: ({ browser, settings }) =>
      iconPart(
        settings.sortTrigger,
        browser.sortField === null ? "sort" : direction(browser),
      ),
    sortPrepend: ({ item }) => iconOf(item.icon),
    sortAppend: ({ browser, item }) =>
      browser.sortField === item.key ? [icon(direction(browser))] : [],
    crumbPrepend: ({ item, index }) =>
      index === 0 ? [icon("folder-open")] : iconOf(item.icon),
    summary: ({ browser }) =>
      textSlot(
        text("browser.summary", {
          folders: browser.folders.length,
          files: browser.files.length,
        }),
      ),
    refresh: ({ settings }) => iconPart(settings.refresh, "refresh"),
    syncLabel: ({ item }) => syncLabel(item),
    syncAppend: ({ browser, item }) => syncMark(browser.sync, item),
    actions: ({ settings }) => iconPart(settings.actionsTrigger, "actions"),
    folderActions: ({ settings }) =>
      iconPart(settings.actionsTrigger, "actions"),
    folderPrepend: () => [icon("folder")],
    bulkActionPrepend: ({ action }) => iconOf(action.icon),
    bulkClear: () => textSlot("browser.clear"),
    empty: ({ browser }) =>
      textSlot(browser.isFiltered ? "browser.noMatches" : "browser.empty"),
    noFiles: () => textSlot("browser.noFiles"),
  },
});
