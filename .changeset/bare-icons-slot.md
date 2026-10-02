---
"@zoobzio/foundation": patch
---

Decouple icons from the layer: components no longer render icons. The `@icon-sheets/nuxt` module and its `config/icon-sheets` registry are no longer registered or shipped, and with them go the global `Icon` component, the `IconAlias` type, the `icon` prop on `Fab`, the `icon` field on options, links, menu/tree/breadcrumb/directory items, folders, and action descriptors, `rootIcon` on the browser config, and `getSortIcon()` on the table and browser services.

Every former icon position is a slot instead: existing icon slots (`itemIcon`, `triggerIcon`, `prevIcon`, `nextIcon`, `closeIcon`, …) keep their names with no icon fallback, new slots cover the remaining positions (`backToTopIcon`, `stepSeparator`, pagination's `firstIcon`/`lastIcon`, …), and the data widgets relay named slots (`refreshIcon`, `columnsIcon`, `sortIcon`, `dragIcon`, `actionsIcon`, `actionIcon`, `bulkActionIcon`, `controlIcon`, …) down to their nested controls. `Fab` renders its `label` as visible text when its `icon` slot is empty, and every built-in `Fab` now carries a label.
