# @zoobzio/foundation-mcp

## 0.0.17

### Patch Changes

- Updated dependencies [[`f6b8637`](https://github.com/zoobzio/foundation/commit/f6b8637c6ac67057881d0fb6ef19a94600859d09)]:
  - @zoobzio/foundation@0.0.17

## 0.0.16

### Patch Changes

- [`ea0552f`](https://github.com/zoobzio/foundation/commit/ea0552fcaac7bdfb3f1811b2154ca04a2beffb7b) Thanks [@zoobzio](https://github.com/zoobzio)! - Widgets: replace the create\* thunk factories with the define/use model.
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

- Updated dependencies [[`ea0552f`](https://github.com/zoobzio/foundation/commit/ea0552fcaac7bdfb3f1811b2154ca04a2beffb7b), [`b78bdc0`](https://github.com/zoobzio/foundation/commit/b78bdc0b1d23f54143f7d0d8e8cd1665d2d46a59)]:
  - @zoobzio/foundation@0.0.16

## 0.0.15

### Patch Changes

- [`88ad11a`](https://github.com/zoobzio/foundation/commit/88ad11a51befa4b5ca3750c6c821ca0edc5b5290) Thanks [@zoobzio](https://github.com/zoobzio)! - Republish with a resolved peer dependency: 0.0.14 shipped with the raw `workspace:*` protocol in `peerDependencies`, making the package uninstallable outside the monorepo.

- Updated dependencies []:
  - @zoobzio/foundation@0.0.15

## 0.1.0

### Minor Changes

- [`6307e49`](https://github.com/zoobzio/foundation/commit/6307e49bd90d982f751014f1cd4fa23b1d35823a) Thanks [@zoobzio](https://github.com/zoobzio)! - Add `@zoobzio/foundation-mcp` — a stdio MCP server giving coding agents structured context on the foundation layer without reading the repo. Tools: `list_components` (catalog by tier), `describe_component` (`#foundation/*` import paths, element roles + token slots, type/definition source), and `help` (the root and per-tier authoring guides). Lookups serve a build-time `catalog.json` generated from `app/components/*` joined with `config/components.ts`; file contents resolve at runtime from the consumer's installed `@zoobzio/foundation` (peer dependency).
