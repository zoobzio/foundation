---
"@zoobzio/table": patch
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
---

The table scrolls sideways. The vue `table.vue` renders its `table` element within a horizontal `scroller.vue`, `.f-data-table-scroller`, between the toolbar and the pagination, so columns resized past the space the table has scroll within it rather than widening the page. `pt.scroller` configures it or swaps it through `as`. The nuxt wrapper renders it as the layer's `Scroller`.

A column that grows no longer squeezes the others to nothing. `@zoobzio/table` has `columnsMinWidth`, the narrowest the visible columns go together: the widths of the sized ones plus room for every unsized one to hold the widest `minWidth` among them. The vue table carries it on the `table` element as an inline `min-width`, so the unsized columns give way down to their minimum and from there the table widens and scrolls.

Breaking: the `table` element is no longer a child of `.f-data-table`, so a `.f-data-table > .f-table` selector no longer matches. A stylesheet moves the table's frame (border, radius, clipping) to `.f-data-table-scroller`, styles its `.f-scroll-area-scrollbar` and `.f-scroll-area-thumb`, and lets the root's track shrink (`grid-template-columns: minmax(0, 1fr)` on a grid root), or the root grows with the table and nothing scrolls.
