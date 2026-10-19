---
"@zoobzio/form": minor
"@zoobzio/foundation": minor
---

Extract the data form service into the headless `@zoobzio/form` package. The
service, its state container factory, the field and payload types, and the
schema helpers (`check`, `flatten`, formerly `utils/schema`) now live there
with no framework dependency; Zod is the package's only domain dependency.
The service reads and writes a plain state container through optional
get/set middleware and emits `change`, `initialized`, `submitted`,
`rejected`, `restored`, `reset`, and `failed` through its own `on`
listeners. A failure in `initialize`, `restore`, or `submit` is now reported
(`failed` with its `stage`, relayed as the `form:failed` hook and the
widget's `failed` emit) before it is rethrown. The layer keeps the Nuxt
wiring in `stores/form` (one `useState` container per form id) and
`factories/form` (events relayed onto the hook bus and logger).
`@zoobzio/foundation/services/form` and `@zoobzio/foundation/utils/schema`
are removed — import `FormService` from `@zoobzio/form`. Type and constant
import paths on the layer are unchanged. The form widget no longer inits the
service on mount — the caller drives `initialize()`, as the table widget
does.
