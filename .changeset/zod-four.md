---
"@zoobzio/form": patch
---

Move to Zod 4 (`^4.6.5`). `Config.schema` is now typed against Zod 4's `ZodType`, so consumers must supply Zod 4 schemas; Zod 3's `UnknownKeysParam`-based `ZodObject` signature no longer applies. The service now shallow-freezes its `config`, so a reactive wrapper of the service (Vue's `reactive`) never proxies the schema: Zod 4 defines a non-configurable `_zod` on every schema, and a proxied schema trips the Proxy `get` invariant on the first parse.
