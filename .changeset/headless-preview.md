---
"@zoobzio/preview": minor
"@zoobzio/foundation": minor
---

Extract the data preview service into the headless `@zoobzio/preview`
package. The service, its state container factory, and domain types now live
there with no framework dependency. The service reads and writes a plain
state container through optional get/set middleware and emits `change` and
`loaded` through its own `on` listeners. The layer keeps the Nuxt wiring in
`stores/preview` (one `useState` container per preview id) and
`factories/preview` (events relayed onto the hook bus and logger).
`@zoobzio/foundation/services/preview` is removed — import `PreviewService`
from `@zoobzio/preview`. Type and constant import paths on the layer are
unchanged. The preview widget no longer inits the service on mount — the
caller drives `init()`, as the table widget does.
