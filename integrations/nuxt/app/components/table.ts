// The vue table with the layer's parts behind its own: NuxtLink under the
// body's `link`, the layer's Menu for row actions (so an action's `icon`
// draws), the layer's Checkbox for the row and select-all checkboxes, the
// layer's Command behind the column manager, the layer's TableSearch (its
// Autocomplete with the `magic` icon, the `/` key hint, and the `/` key
// focusing it) as the search, and the layer's Pagination.
// Its Fab slots draw the `refresh`, `columns`, and `actions` icons; the
// head draws `drag` on each handle, a column's own `icon` before its
// header, and `sort-asc` or `sort-desc` after a sorted header; a bulk action
// draws its own `icon`. Its own text — the toolbar's labels and
// placeholders, the empty state, the clear button — reads in the
// visitor's locale, and a date, number, currency, file size or boolean
// cell formats through the app's prosary service, a date or a datetime in
// the table's time zone.
import type {
  TableBodyPassthrough,
  TableCellContext,
} from "@zoobzio/vue/types/components/table-body";
import type { TableColumnsPassthrough } from "@zoobzio/vue/types/components/table-columns";
import type { TableHeadPassthrough } from "@zoobzio/vue/types/components/table-head";

import Core from "@zoobzio/vue/components/table.vue";

import NuxtLink from "#app/components/nuxt-link";
import { layer } from "@zoobzio/vue/utils/passthrough";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Checkbox from "./checkbox";
import Command from "./command";
import Menu from "./menu";
import Pagination from "./pagination";
import TableSearch from "./table-search";
import { icon, iconOf, iconPart } from "./icon";
import { cellSlots } from "./cell";
import { text, textSlot } from "./text";

export default wrap(Core, {
  pt: (pt) => ({
    ...pt,
    search: {
      as: TableSearch,
      placeholder: text("table.search"),
      ...pt?.search,
    },
    refresh: { label: text("table.refresh"), ...pt?.refresh },
    pagination: { as: Pagination, ...pt?.pagination },
    head: layer<TableHeadPassthrough>(pt?.head, {
      selectAllCheckbox: { as: Checkbox },
    }),
    body: layer<TableBodyPassthrough<unknown>>(pt?.body, {
      link: () => ({ as: NuxtLink }),
      rowCheckbox: { as: Checkbox },
      actionsTrigger: { label: text("table.actions") },
      actionsMenu: { as: Menu },
    }),
    columns: layer<TableColumnsPassthrough>(pt?.columns, {
      trigger: { label: text("table.columns") },
      command: { as: Command, placeholder: text("table.searchColumns") },
    }),
  }),
  slots: {
    ...cellSlots<TableCellContext<unknown>>(({ table }) => table),
    refresh: ({ settings }) => iconPart(settings.refresh, "refresh"),
    columns: ({ settings }) => iconPart(settings.trigger, "columns"),
    actions: ({ settings }) => iconPart(settings.actionsTrigger, "actions"),
    dragPrepend: () => [icon("drag")],
    headerPrepend: ({ column }) => iconOf(column.icon),
    headerAppend: ({ table, column }) =>
      table.isSorted(column)
        ? [icon(table.sortDirection === "asc" ? "sort-asc" : "sort-desc")]
        : [],
    bulkActionPrepend: ({ action }) => iconOf(action.icon),
    bulkClear: () => textSlot("table.clear"),
    empty: () => textSlot("table.empty"),
  },
});
