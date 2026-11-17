---
"@zoobzio/table": patch
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
"@zoobzio/prose": patch
"@zoobzio/icons": patch
---

The table pins columns. The service registers TanStack's column pinning: the container holds `columnPinning` (`{ start, end }`), `initialState.columnPinning` and a column's `enablePinning` are the table's own, the `pin` permission answers `column.getCanPin()`, and `snapshot()` and `restore()` carry the slice, as `TABLE_VIEW_SCHEMA` does with an empty default, so a view saved before it still reads. Breaking: `State` and `Snapshot` have a `columnPinning` member. The Vue table lays the columns out pinned to the start, unpinned, then pinned to the end, and marks a pinned column's cells with `f-data-table-pinned` and where they stick, for the stylesheet to make sticky; the actions column is always pinned to the end, and the select column to the start once a column is. Each header holds a pin menu (`pt.head.pinMenu`, `pt.head.pinTrigger`, the `pin` slot), and a drag moves a column within its region. The table's `min-width` counts `--f-data-table-start-inset` and `--f-data-table-end-inset`, the widths a stylesheet gives the select and actions columns, so the last column no longer gives its width up to them once the table scrolls. The Nuxt layer dresses the menu with the `pin`, `unpin`, `pin-start`, and `pin-end` icons and the `table.pin`, `table.pinStart`, `table.pinEnd`, and `table.unpin` messages. Its checkbox draws the new `indeterminate` icon in place of `check` while it is neither on nor off, as the select-all of a table or a browser is over some of its rows.
