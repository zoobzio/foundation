---
"@zoobzio/nuxt": patch
---

fix: raise the catalog `vue` range to `^3.5.44` and dedupe the lockfile so the workspace resolves a single Vue. Nuxt 4.6 requires `^3.5.44` while the catalog still resolved `3.5.39`, leaving two copies of `vue` and `@vue/*` installed. Nitro writes every multi-version package into `.output/server/node_modules/.nitro/<pkg>@<version>` with nested `node_modules` symlinks between parent and child; because `vue` depends on `@vue/server-renderer` and `@vue/server-renderer` has `vue` as a peer, those links formed a cycle and the post-build size scan failed with `ELOOP: too many symbolic links encountered`. With one Vue version Nitro links the packages flat and `nuxi build` completes.
