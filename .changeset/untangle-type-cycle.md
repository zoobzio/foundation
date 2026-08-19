---
"@zoobzio/foundation": patch
---

Break the 6-module type-import cycle in the type/config core by giving two
symbols canonical leaf modules. BREAKING: import paths changed — there are
no re-exports from the old homes.

- `Element`, `Compound`, and `Component` moved from `types/component` to a
  new `types/element` (derived from the registry, upstream of the prop-type
  modules).
- `Token` moved from `types/tokens` to a new `types/token` (derived from the
  untheme contract, upstream of `config/components`).

`ComponentProps` stays in `types/component`; `TokenProps` and `TokenBindings`
stay in `types/tokens`. The type graph is now acyclic: contract → token →
registry → element → prop types → component.
