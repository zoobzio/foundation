---
"@zoobzio/form": patch
"@zoobzio/vue": patch
---

A form's choice fields (`select`, `radio`, `multi-select`) can key a payload property typed as a string literal union. `Option<V>` is generic over its value, and the three field variants take `V` too: in `Field<T>` each is instantiated once per payload property with the property's own string type, so a select over `role: "admin" | "member"` keys the property, its options are checked against the union, and the config can take the schema's output type as `T` directly. Over a plain `string` property the options stay `Option<string>[]`, as before. The form component's submit recipe now catches the service's rejection: a failed submit action reaches the consumer as the `failed` emit and no longer escapes as an unhandled rejection.
