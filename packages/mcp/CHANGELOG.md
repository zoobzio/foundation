# @zoobzio/foundation-mcp

## 0.0.21

### Patch Changes

- Updated dependencies [[`840d56f`](https://github.com/zoobzio/foundation/commit/840d56f1a9d4d0e441b09cf7a43d423ded87cc88)]:
  - @zoobzio/foundation@0.0.21

## 0.0.20

### Patch Changes

- [`b0e1667`](https://github.com/zoobzio/foundation/commit/b0e1667430ade20b7b84e70c1dac76b594ccfb9f) Thanks [@zoobzio](https://github.com/zoobzio)! - Add a `health` tool: a graph-wide report that aggregates the diagnostics
  the module graph already collects into one actionable summary — parse
  errors, unresolved imports, and catalog drift (errors); import cycles
  (with type-only cycles labeled), tier-layering violations
  (common < core < data < system), dead-code candidates, and
  imported-but-never-rendered components (warnings); blast-radius hotspots
  and catalog adoption by the consuming app (info). Empty sections are
  omitted; pass `section` to get one section in full detail.

- [`2004da5`](https://github.com/zoobzio/foundation/commit/2004da508e4580ef4c04fa32666b895ce710e544) Thanks [@zoobzio](https://github.com/zoobzio)! - Add deterministic module-graph query tools: `resolve`, `usages`,
  `dependencies`, and `dependents`. The server scans the installed layer and
  the consuming Nuxt app into one unified import graph (script imports,
  type-only imports, and SFC template render sites, with line numbers),
  annotates layer files with their catalog identity, and answers
  "where is X / what uses X / what is X built from / what breaks if X
  changes" without filesystem exploration. Consumer root is cwd when it holds
  a nuxt config, or `FOUNDATION_MCP_APP_DIR`.
- Updated dependencies [[`abcf5f9`](https://github.com/zoobzio/foundation/commit/abcf5f950f9de9308d2513d201836574b33096c6)]:
  - @zoobzio/foundation@0.0.20

## 0.0.19

### Patch Changes

- Updated dependencies [[`81ffc97`](https://github.com/zoobzio/foundation/commit/81ffc97e26de769363c643a26a15a7442cd2c24f)]:
  - @zoobzio/foundation@0.0.19

## 0.0.18

### Patch Changes

- Updated dependencies [[`b4a745c`](https://github.com/zoobzio/foundation/commit/b4a745cd9254ea9b031621f88e965138d1dde9be)]:
  - @zoobzio/foundation@0.0.18

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
