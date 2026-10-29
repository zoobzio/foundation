// The vue table with the layer's parts behind its own: NuxtLink under the
// body's `link`, the layer's Menu for row actions (so an action's `icon`
// draws), the layer's Checkbox for the row and select-all checkboxes, the
// layer's Command behind the column manager, the layer's Autocomplete as
// the search, and the layer's Pagination.
// Its Fab slots draw the `refresh`, `columns`, and `actions` icons; the
// head draws `drag` on each handle and `sort-asc` or `sort-desc` after a
// sorted header; a bulk action draws its own `icon`.
import type { TableBodyPassthrough } from "@zoobzio/vue/types/components/table-body";
import type { TableColumnsPassthrough } from "@zoobzio/vue/types/components/table-columns";
import type { TableHeadPassthrough } from "@zoobzio/vue/types/components/table-head";

import Core from "@zoobzio/vue/components/table.vue";

import NuxtLink from "#app/components/nuxt-link";
import { layer } from "@zoobzio/vue/utils/passthrough";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Autocomplete from "./autocomplete";
import Checkbox from "./checkbox";
import Command from "./command";
import Menu from "./menu";
import Pagination from "./pagination";
import { icon, iconOf, iconPart } from "./icon";

export default wrap(Core, {
  pt: (pt) => ({
    ...pt,
    search: { as: Autocomplete, ...pt?.search },
    pagination: { as: Pagination, ...pt?.pagination },
    head: layer<TableHeadPassthrough>(pt?.head, {
      selectAllCheckbox: { as: Checkbox },
    }),
    body: layer<TableBodyPassthrough<unknown>>(pt?.body, {
      link: () => ({ as: NuxtLink }),
      rowCheckbox: { as: Checkbox },
      actionsMenu: { as: Menu },
    }),
    columns: layer<TableColumnsPassthrough>(pt?.columns, {
      command: { as: Command },
    }),
  }),
  slots: {
    refresh: ({ settings }) => iconPart(settings.refresh, "refresh"),
    columns: ({ settings }) => iconPart(settings.trigger, "columns"),
    actions: ({ settings }) => iconPart(settings.actionsTrigger, "actions"),
    dragPrepend: () => [icon("drag")],
    headerAppend: ({ table, column }) =>
      table.isSorted(column)
        ? [icon(table.sortDirection === "asc" ? "sort-asc" : "sort-desc")]
        : [],
    bulkActionPrepend: ({ action }) => iconOf(action.icon),
  },
});
