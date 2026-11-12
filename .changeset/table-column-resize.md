---
"@zoobzio/table": patch
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
"@zoobzio/prose": patch
---

The table's columns resize. The service's container gains `columnWidths`, the width of each sized column in pixels by column key, seeded from the `width` a column declares; `resizeColumn(key, width)` rounds a width and holds it at the column's `minWidth` (`TABLE_MIN_COLUMN_WIDTH`, 48, where it names none), `resetColumnWidth(key)` restores the declared width or none, `columnWidth(key)` and `columnMinWidth(key)` read them, and `resetColumns()` now restores the declared widths along with the default order. A column's `width` and `minWidth` stay off its query field and its column manager option. The vue table renders a resizer on every column's trailing border, a focusable `separator` in the `th` named for its column: a drag writes the width as the pointer moves, the arrow keys step it, and a double click or Enter resets it (`pt.head.resizer`, the `f-data-table-resizer` and `f-data-table-resizing` classes, the new `useResize` composable). The table renders the widths by value, in a `colgroup` with one `col` per rendered column. `TableHeadPassthrough` takes the row type. The nuxt layer names each resizer in the visitor's locale (`table.resize`, new in the prose contract) and takes `columnWidths` in a table's `initial`.
