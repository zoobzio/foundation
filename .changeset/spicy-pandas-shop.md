---
"@zoobzio/foundation": patch
---

Add package subpath exports for all `app/` resources — composables, utils, types, constants, definitions, factories, services, stores, plugins, and components (both extensionless and `.vue`-suffixed) — so consumers with auto-imports disabled can import everything explicitly via `@zoobzio/foundation/*`. Exclude the package from Vite dep optimization to keep subpath imports deduped with the layer's own modules in dev.
