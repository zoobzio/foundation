---
"@zoobzio/foundation": patch
---

Ship `app/tsconfig.json` mapping `#foundation/*` so `@vue/compiler-sfc` can resolve type imports in `defineProps` macros when the layer is consumed from node_modules. The alias was only defined as a Nuxt/Vite alias, but compiler-sfc resolves macro type imports with TypeScript module resolution via the nearest tsconfig, which the published package didn't provide.
