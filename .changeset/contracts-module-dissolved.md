---
"@zoobzio/foundation": patch
---

Dissolve the `contracts` build-time module; no generated `#build` types remain in the layer.

- Aria: `GlobalAria` / `RoleAria` / `ProhibitedAria` are committed source in `app/types/aria-spec.ts`, regenerated from `aria-query` via `make generate` (`scripts/aria.ts`).
- Modifiers: the schema is author-owned in `config/modifiers.ts`; `ComponentModifiers` derives type-level from it. The `modifiers` nuxt.config key, dev stub, and `defineModifiers` are removed.
- Events: components declare their own emits contracts via `EventEmits<...>` in their type files (`app/types/events.ts`); the `ComponentEvents` registry and the `events` lists in `config/components.ts` are removed.
- `modules/` and `stubs/` are deleted, along with the `#stubs` alias.
