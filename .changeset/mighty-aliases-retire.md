---
"@zoobzio/foundation": patch
---

Replace the `#foundation`, `#config`, and `#modules` import aliases with relative paths so the layer resolves correctly when extended by a consumer app. The aliases are removed from `nuxt.config.ts`, `vitest.config.ts`, and the package.json `imports` map; `#stubs` and `#test` remain for internal consumers.
