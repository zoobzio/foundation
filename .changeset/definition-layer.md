---
"@zoobzio/foundation": patch
---

Introduce the definition layer and rename specs to definitions.

- `define*` is now the stable authoring verb across every layer: a definition is a static declaration of component infrastructure, declared as a named const and composed by reference. Only the shape changes with the layer — composites bind props, data features bundle config/actions/settings, structures arrange registries, adapters capture components.
- Every core composite ships `define<Name>` in `definitions/<name>.ts`: `<Name>Definition` is `Definition<Props, Emits>` (`types/definition.ts`) — props plus emit listeners in `on*` form, the object a template `v-bind`s and an adapter captures as `settings`.
- Data features gain `<Name>Definition` bundles (`{ config, actions, settings? }`) and `define<Name>` constructors; all six factories migrate from positional args to `create<Name>(id, definition)` — instancing is the only thing a factory adds.
- Adapter authoring moves to `defineAdapter<Contract>({ component, emits, settings })` — contract verification, exhaustive emit acknowledgment, and required-settings enforcement all happen at the define site; `Contract` is now an alias of `Definition`, so composite definitions slot into `settings` directly.
- `specs/` is renamed `definitions/` throughout: `types/spec.ts` → `types/definition.ts`, `WorkspaceSpec`/`PanelSpec` → `WorkspaceDefinition`/`PanelDefinition`, and structures take a `definition` prop instead of `spec`.
