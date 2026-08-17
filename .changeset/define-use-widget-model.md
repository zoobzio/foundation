---
"@zoobzio/foundation": patch
"@zoobzio/foundation-mcp": patch
---

Widgets: replace the create\* thunk factories with the define/use model.
`define*` returns inert typed config (storable in constants), per-feature
`use*(id, definition)` composables instance it in setup — the user maps each
definition to its composable explicitly, no framework correlation. `Widgets`
is now a record of live widgets (`Resolved`/`useWidgets` deleted); internal
view-surface composables that collided take the View suffix (`useTableView`,
`useFormView`, …).

Structures: `definePanel({ header?, content?, footer? })` holds widget
definitions keyed by region and `usePanel(widgets, wire?)` assembles the
live handle (`{ widgets, services }`) from instanced widgets.
`defineWorkspace({ columns, rows, slots })` keys each slot by id with
placement and widget definition together — the `widget: keyof R` assignment
layer is gone — and `useWorkspace(definition, widgets, wire?)` guards the
slot-id vocabulary and carries the layout on the handle. Wiring lives in
setup in both structures, so handlers may close over page context; widget
lifetime follows the caller's scope. Tier READMEs and the MCP server's
vocabulary updated to match.
