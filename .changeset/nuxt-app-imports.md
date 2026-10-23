---
"@zoobzio/nuxt": patch
---

The layer's own code no longer reads from `#imports` or `#components`.

- Both are the consumer's build artifacts: the imports module fills them, and the layer's source imports Nuxt APIs from `#app`, Vue APIs from `vue`, and `NuxtLink` from `#app/components/nuxt-link`. Only `app.vue` keeps `#components`, for the shell built-ins whose module depends on the consumer's pages.
- An oxlint layer graph (types > constants > utils > stores > composables > factories > components > plugins) refuses an import from a higher layer, a cycle, and the two aliases, so the layer's `#imports` surface cannot be used to route around it.
