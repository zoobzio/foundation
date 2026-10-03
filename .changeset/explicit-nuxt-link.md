---
"@zoobzio/foundation": patch
---

Components that render links (Breadcrumb, Directory, Menu, SegmentedControl, Tabs, Tree, and the data browser/table rows) now import `NuxtLink` explicitly from `#components` instead of relying on auto-import resolution. The layer's `nuxt.config.ts` also no longer adds the test-only `../tests/**/*` include and `#test/*` path alias to the generated tsconfig, so consuming apps don't inherit references to a `tests` directory that isn't published.
