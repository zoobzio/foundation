---
"@zoobzio/foundation": patch
---

Move `aria-query` and `@types/aria-query` from devDependencies to dependencies. The contracts module imports `aria-query` at build time, so consumers extending the layer failed `nuxi prepare` with "Cannot find module 'aria-query'".
