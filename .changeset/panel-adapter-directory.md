---
"@zoobzio/foundation": patch
---

Add the panel structure, the adapter widget, and the directory core component.

- **Panel** (`components/system/panel.vue`, `definePanel`): a system structure with three fixed regions — header, content, footer — each resolved from the spec's widget registry. No arrangement math; layout is userland styling. Regions with neither a widget nor slotted content are omitted from the DOM. Standard override cascade: region slot → `widget:<key>` typed slot → erased render.
- **Adapter** (`createAdapter<Contract>(id, { component, emits }, settings?)`): lifts a plain component into the widget contract so userland content is resolvable wherever structures resolve widgets. The contract type is the authored surface — composable from a component's existing types via `Contract<Props, Emits>` (e.g. `Contract<DirectoryProps<T>, DirectoryEmits<T>>`) — the component must implement it, `settings`/`patch` check against exactly its props, and `emits` must acknowledge every listener prop it declares (exhaustive record, so the typed wire surface and the runtime bridge cannot drift); `settings` becomes mandatory when the contract has required props. The service's `patch`/`reset` override layer gives spec wiring imperative prop control, and every contract emit bridges onto the hook bus as an id-scoped `adapter:emitted` event with typed narrowing via the widget events phantom.
- **Directory** (`components/core/directory.vue`): a grouped list of clickable items for navigation and command surfaces. Items with `link` render as real hyperlinks through Anchor (NuxtLink semantics intact), the rest as Buttons; both dispatch a typed `select` emit carrying the consumer's extended item. Native `nav > ul > li` semantics, full part manifest per the core contract.
