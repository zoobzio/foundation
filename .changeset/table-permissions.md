---
"@zoobzio/table": patch
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
---

Table permissions. `@zoobzio/table` takes `permissions` in its config: one record of booleans over what a visitor may do (`search`, `sort`, `multiSort`, `select`, `actions`, `bulkActions`, `hide`, `reorder`, `resize`, `pageSize`, `refresh`), so the answers of an app's permission model drop straight in. `true` grants, `false` takes away, and one left out is granted (`TABLE_DEFAULT_PERMISSIONS`). `service.can(permission)` is the check; the table's own follow it (`getCanSort()`, `getCanMultiSort()`, `getCanHide()`, `getCanResize()`, `row.getCanSelect()`), `actions` and `bulkActions` are empty and run nothing without theirs, and a write of the column order or the page size through the table is dropped without its permission. The record is read on every check, so a reactive one is followed. A permission taken away leaves the state as it is, and `restore` applies a snapshot whatever the permissions say.

Breaking: `searchable` is gone from the config and the service, for `permissions.search`. The table-wide `enableSorting`, `enableMultiSort`, `enableHiding`, and `enableColumnResizing` are no longer config, and `enableRowSelection` is a predicate over the row only: rows select with the `select` and `bulkActions` permissions and bulk actions to run, so a table without bulk actions no longer selects by `enableRowSelection: true`. A column's own `enableSorting`, `enableHiding`, and `enableResizing` stand.

The table registers TanStack's `columnResizingFeature`, for `enableResizing` on a column and `column.getCanResize()`. Its `columnResizing` state, the progress of a resize through TanStack's own handler, stays with the table and out of the container.

The vue table renders what the permissions grant: no search, column manager, or refresh, a plain header, no drag handle, no resizer, no size picker, and no checkbox or actions column without theirs. `pagination.vue` takes `sizable`, which leaves the size picker out when `false`.

The nuxt layer's table composable takes the visitor's permissions, as a record, a ref, or a getter, over the options' own: `useUsers(() => ({ bulkActions: can("users.write") }))`.
