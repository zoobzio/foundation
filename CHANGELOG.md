# @zoobzio/foundation

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
