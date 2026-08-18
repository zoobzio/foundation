---
"@zoobzio/foundation": patch
---

Icons: adopt icon-sheets — the layer registers `@icon-sheets/nuxt` and
authors its icon contract in `config/icon-sheets.ts` as semantic aliases
mapped to Iconify refs (lucide, with mdi filling the chart shapes lucide
lacks). Refs resolve at build time against the local `@iconify-json/*`
collections, the module inlines the sprite into the document server-side,
and `common/icon.vue` now references it with same-document fragment refs
(`#alias`) instead of the unserved `/icons.svg` path.

`IconAlias` is no longer `string`: it re-exports the build-derived alias
union from `#build/types/icon-sheets`, so an unregistered alias fails to
compile. The `types/common/iconic` stopgap module is gone — import
`IconAlias` from `types/common/icon` instead (breaking for anyone who
imported the `iconic` subpath). Components with optional icons assert the
alias behind their existing `v-if` guards rather than passing an empty
string, and the contract picks up the aliases the narrowed type surfaced:
`check`, `close`, `delete`, `edit`, `home`, `minus`, `user`.
