# @zoobzio/foundation

## 0.0.17

### Patch Changes

- [`f6b8637`](https://github.com/zoobzio/foundation/commit/f6b8637c6ac67057881d0fb6ef19a94600859d09) Thanks [@zoobzio](https://github.com/zoobzio)! - Table: complete the define/use split — the definition is now strictly
  serializable and all functional wiring attaches in setup.

  Selection drops the `K` generic and stores stringified row keys: `selected`
  is `Set<string>`, `keyOf` returns `String(row[rowKey])`, and every table
  type is single-generic over the row.

  `defineEntity<T>()` is the new authoring entry: it binds the entity type
  once and yields definers scoped to it, so each definer stays generic over
  its definition alone and record keys survive as literals. Its `defineTable`
  returns a flat `TableDefinition<T>` — columns, rowKey, action/bulk
  descriptor records (`{ icon, label }` keyed by action id), pinned/order,
  and a static `pt` base — stamped with the phantom `Stamp<T>` (`$contract`)
  so `useTable` infers `T` from the definition itself.

  `useTable(id, definition, wiring)` owns the behavior: `fetch` (required),
  `actions`/`bulkActions` handler records keyed to the definition's
  descriptor vocabulary (required exactly when descriptors exist, rejected
  when they don't), and a reactive `pt` override merged over the definition's
  base per key. The service joins descriptors to handlers by key into the
  same fused shape the view already renders, so components and view
  composables are untouched.

  Deck follows the same split: `defineDeck` on the entity yields a flat
  stamped `DeckDefinition<T>` (topic, rowKey, dateFields, polling/page
  config, pt base), and `useDeck(id, definition, wiring)` takes `fetch` and
  the reactive pt override. Deck has no action records, so its wiring is
  `T`-generic only.

  Preview follows the same split: `definePreview` on the entity yields a
  flat stamped `PreviewDefinition<T>` (fields, content variant, pt base),
  and `usePreview(id, definition, wiring)` takes `fetch` and the reactive pt
  override.

  Chart follows the same split: `defineChart` on the entity yields a flat
  stamped `ChartDefinition<T>` (topic, variant configs, color map, pt base),
  and `useChart(id, definition, wiring)` takes one fetcher per declared
  variant — required exactly when that variant's config exists, rejected
  when it doesn't — plus the reactive pt override.

  Form follows the same split, with one deliberate scope call: the Zod
  schema travels with the definition — it is the form's intrinsic contract,
  not wiring — so `defineForm` on the entity yields a flat stamped
  `FormDefinition<T>` (title, fields, schema, defaults, pt base).
  `useForm(id, definition, wiring?)` takes the optional init/submit
  lifecycle, per-key middleware, and the reactive pt override; the wiring
  argument is omittable for local-only forms. Autocomplete migrates in a
  later release.

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

- [`b78bdc0`](https://github.com/zoobzio/foundation/commit/b78bdc0b1d23f54143f7d0d8e8cd1665d2d46a59) Thanks [@zoobzio](https://github.com/zoobzio)! - Menu: wire the dropdown-menu item's `select` re-emit so item clicks reach the
  core menu's `select` emit (previously declared but silently dead), and add a
  default trigger — a `label` prop rendered through a common Button
  (`pt.triggerButton`) when no trigger content is slotted.

## 0.0.15

## 0.0.14

### Patch Changes

- [`82fbee5`](https://github.com/zoobzio/foundation/commit/82fbee5c9e3add0bd9aeb79818ac385427a9e4a3) Thanks [@zoobzio](https://github.com/zoobzio)! - Add package subpath exports for all `app/` resources — composables, utils, types, constants, definitions, factories, services, stores, plugins, and components (both extensionless and `.vue`-suffixed) — so consumers with auto-imports disabled can import everything explicitly via `@zoobzio/foundation/*`. Exclude the package from Vite dep optimization to keep subpath imports deduped with the layer's own modules in dev.

## 0.0.7

### Patch Changes

- [`1af51d4`](https://github.com/zoobzio/foundation/commit/1af51d4a67be6c56c5e8d8a2e40f4e7549da4f12) Thanks [@zoobzio](https://github.com/zoobzio)! - Dissolve the `contracts` build-time module; no generated `#build` types remain in the layer.

  - Aria: `GlobalAria` / `RoleAria` / `ProhibitedAria` are committed source in `app/types/aria-spec.ts`, regenerated from `aria-query` via `make generate` (`scripts/aria.ts`).
  - Modifiers: the schema is author-owned in `config/modifiers.ts`; `ComponentModifiers` derives type-level from it. The `modifiers` nuxt.config key, dev stub, and `defineModifiers` are removed.
  - Events: components declare their own emits contracts via `EventEmits<...>` in their type files (`app/types/events.ts`); the `ComponentEvents` registry and the `events` lists in `config/components.ts` are removed.
  - `modules/` and `stubs/` are deleted, along with the `#stubs` alias.

- [`ea176bc`](https://github.com/zoobzio/foundation/commit/ea176bc1112de1b16de16bfed696468930874150) Thanks [@zoobzio](https://github.com/zoobzio)! - Replace the `#foundation`, `#config`, and `#modules` import aliases with relative paths so the layer resolves correctly when extended by a consumer app. The aliases are removed from `nuxt.config.ts`, `vitest.config.ts`, and the package.json `imports` map; `#stubs` and `#test` remain for internal consumers.

## 0.0.6

### Patch Changes

- [`1556e2d`](https://github.com/zoobzio/foundation/commit/1556e2db6ae24c58144403d511029e1b759dc015) Thanks [@zoobzio](https://github.com/zoobzio)! - Move `aria-query` and `@types/aria-query` from devDependencies to dependencies. The contracts module imports `aria-query` at build time, so consumers extending the layer failed `nuxi prepare` with "Cannot find module 'aria-query'".

## 0.0.5

### Patch Changes

- [`4aa5fcf`](https://github.com/zoobzio/foundation/commit/4aa5fcfc08f9a41d0e8fc11daab5f51a80546e54) Thanks [@zoobzio](https://github.com/zoobzio)! - Fix the release pipeline and move releases to the `latest` dist-tag.

  - The release workflow now upgrades npm before publishing: OIDC trusted publishing requires npm ≥ 11.5.1, and Node 22's bundled npm 10.x silently skipped the token exchange, hitting the registry unauthenticated (the E404-on-PUT failure).
  - Dropped `publishConfig.tag: "alpha"` — releases publish to `latest`, so plain installs resolve the current version.

## 0.0.4

### Patch Changes

- [`7b4d442`](https://github.com/zoobzio/foundation/commit/7b4d442a16a3fe8a70226f1da25dbc2bf041acb9) Thanks [@zoobzio](https://github.com/zoobzio)! - Introduce the definition layer and rename specs to definitions.

  - `define*` is now the stable authoring verb across every layer: a definition is a static declaration of component infrastructure, declared as a named const and composed by reference. Only the shape changes with the layer — composites bind props, data features bundle config/actions/settings, structures arrange registries, adapters capture components.
  - Every core composite ships `define<Name>` in `definitions/<name>.ts`: `<Name>Definition` is `Definition<Props, Emits>` (`types/definition.ts`) — props plus emit listeners in `on*` form, the object a template `v-bind`s and an adapter captures as `settings`.
  - Data features gain `<Name>Definition` bundles (`{ config, actions, settings? }`) and `define<Name>` constructors; all six factories migrate from positional args to `create<Name>(id, definition)` — instancing is the only thing a factory adds.
  - Adapter authoring moves to `defineAdapter<Contract>({ component, emits, settings })` — contract verification, exhaustive emit acknowledgment, and required-settings enforcement all happen at the define site; `Contract` is now an alias of `Definition`, so composite definitions slot into `settings` directly.
  - `specs/` is renamed `definitions/` throughout: `types/spec.ts` → `types/definition.ts`, `WorkspaceSpec`/`PanelSpec` → `WorkspaceDefinition`/`PanelDefinition`, and structures take a `definition` prop instead of `spec`.

## 0.0.3

### Patch Changes

- [`8c4883e`](https://github.com/zoobzio/foundation/commit/8c4883e2fad7f7e5f8e7751bd4f6799ecd672308) Thanks [@zoobzio](https://github.com/zoobzio)! - Add the panel structure, the adapter widget, and the directory core component.

  - **Panel** (`components/system/panel.vue`, `definePanel`): a system structure with three fixed regions — header, content, footer — each resolved from the spec's widget registry. No arrangement math; layout is userland styling. Regions with neither a widget nor slotted content are omitted from the DOM. Standard override cascade: region slot → `widget:<key>` typed slot → erased render.
  - **Adapter** (`createAdapter<Contract>(id, { component, emits }, settings?)`): lifts a plain component into the widget contract so userland content is resolvable wherever structures resolve widgets. The contract type is the authored surface — composable from a component's existing types via `Contract<Props, Emits>` (e.g. `Contract<DirectoryProps<T>, DirectoryEmits<T>>`) — the component must implement it, `settings`/`patch` check against exactly its props, and `emits` must acknowledge every listener prop it declares (exhaustive record, so the typed wire surface and the runtime bridge cannot drift); `settings` becomes mandatory when the contract has required props. The service's `patch`/`reset` override layer gives spec wiring imperative prop control, and every contract emit bridges onto the hook bus as an id-scoped `adapter:emitted` event with typed narrowing via the widget events phantom.
  - **Directory** (`components/core/directory.vue`): a grouped list of clickable items for navigation and command surfaces. Items with `link` render as real hyperlinks through Anchor (NuxtLink semantics intact), the rest as Buttons; both dispatch a typed `select` emit carrying the consumer's extended item. Native `nav > ul > li` semantics, full part manifest per the core contract.

## 0.0.2

### Patch Changes

- bb258f2: Initial public alpha. Foundation ships as a single Nuxt layer spanning
  behavior-free element wrappers, interactive core components, and generic data
  widgets (table, form, chart, deck, preview), consumed by extending the layer.
