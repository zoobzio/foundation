---
"@zoobzio/table": patch
"@zoobzio/vue": patch
---

A column of `@zoobzio/table` may name a route for its cells: `link: (row) => string` on `DataTableColumn`. The table body of `@zoobzio/vue` renders each cell of such a column through its `link` part, an anchor to the route with no `target` or `rel`, around the content the cell would otherwise render: the type's default formatting or a `cell:<type>` slot. A `cell:<key>` slot still replaces the whole cell, and a `url` column without a route keeps its own link to the value in a new tab. The query does not read `link`, so it stays off the column's field, and the column manager's option. The nuxt layer changes nothing: `NuxtLink` already lies under the body's `link` part, so a linked cell routes through the router.
