// The vue table with the layer's parts behind its own: NuxtLink under the
// body's `link`, the layer's Menu for row actions (so an action's `icon`
// draws), the layer's Checkbox for the row and select-all checkboxes, the
// layer's Command behind the column manager, the layer's TableSearch (its
// Autocomplete with the `magic` icon, the `/` key hint, and the `/` key
// focusing it) as the search, the layer's Scroller around the `table`
// element, and the layer's Pagination.
// Its Fab slots draw the `refresh`, `columns`, and `actions` icons; the
// head draws `drag` on each handle, a column's own `icon` before its
// header, and `sort-asc` or `sort-desc` after a sorted header; a column's
// pin menu is the layer's Menu, opened by `pin` (`unpin` on a pinned
// column), its items drawn with `pin-start`, `pin-end`, and `unpin`; a bulk
// action draws its own `icon`. Its own text — the toolbar's labels and
// placeholders, the empty state, the clear button, the name of a column's
// resizer — reads in the
// visitor's locale, and a date, number, currency, file size or boolean
// cell formats through the app's prosary service, a date or a datetime in
// the table's time zone.
import type {
  TableBodyPassthrough,
  TableCellContext,
} from "@zoobzio/vue/types/components/table-body";
import type { RowData } from "@zoobzio/table";
import type { TableColumnsPassthrough } from "@zoobzio/vue/types/components/table-columns";
import type { TableHeadPassthrough } from "@zoobzio/vue/types/components/table-head";

import Core from "@zoobzio/vue/components/table.vue";
import { columnLabel, pinItems } from "@zoobzio/vue/utils/table";

import NuxtLink from "#app/components/nuxt-link";
import { layer } from "@zoobzio/vue/utils/passthrough";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Checkbox from "./checkbox";
import Command from "./command";
import Menu from "./menu";
import Pagination from "./pagination";
import Scroller from "./scroller";
import TableSearch from "./table-search";
import { icon, iconOf, iconPart } from "./icon";
import { cellSlots } from "./cell";
import { text, textSlot } from "./text";

/** The icon of each item of a column's pin menu. */
const PIN_ICONS = {
  start: "pin-start",
  end: "pin-end",
  none: "unpin",
} as const;

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
    scroller: { as: Scroller, ...pt?.scroller },
    head: layer<TableHeadPassthrough<RowData>>(pt?.head, {
      selectAllCheckbox: { as: Checkbox },
      resizer: (column) => ({
        "aria-label": text("table.resize", {
          column: text(columnLabel(column)),
        }),
      }),
      pinMenu: (column) => ({
        as: Menu,
        groups: [
          {
            key: "pin",
            items: pinItems(column, {
              start: text("table.pinStart"),
              end: text("table.pinEnd"),
              none: text("table.unpin"),
            }).map((item) => ({ ...item, icon: PIN_ICONS[item.key] })),
          },
        ],
      }),
      pinTrigger: (column) => ({
        label: text("table.pin", { column: text(columnLabel(column)) }),
      }),
    }),
    body: layer<TableBodyPassthrough<RowData>>(pt?.body, {
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
    ...cellSlots<TableCellContext<RowData>>(({ table }) => table),
    refresh: ({ settings }) => iconPart(settings.refresh, "refresh"),
    columns: ({ settings }) => iconPart(settings.trigger, "columns"),
    actions: ({ settings }) => iconPart(settings.actionsTrigger, "actions"),
    dragPrepend: () => [icon("drag")],
    pin: ({ settings, column }) =>
      iconPart(
        { ...settings.pinTrigger(column), class: "f-data-table-pin" },
        column.getIsPinned() ? "unpin" : "pin",
      ),
    headerPrepend: ({ column }) => iconOf(column.columnDef.meta?.icon),
    headerAppend: ({ column }) => {
      const sorted = column.getIsSorted();
      return sorted ? [icon(sorted === "asc" ? "sort-asc" : "sort-desc")] : [];
    },
    bulkActionPrepend: ({ action }) => iconOf(action.icon),
    bulkClear: () => textSlot("table.clear"),
    empty: () => textSlot("table.empty"),
  },
});
