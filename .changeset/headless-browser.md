---
"@zoobzio/browser": minor
"@zoobzio/foundation": minor
---

Extract the data browser service into the headless `@zoobzio/browser`
package. The service, its state container factory, domain types (including
its own `BrowserColumn`, `FileAction`, `BulkAction`, and `SortDirection`),
and domain constants now live there with no framework or package dependency.
The service reads
and writes a plain state container through optional get/set middleware and
emits `change`, `updated`, and `navigated` through its own `on` listeners.
The layer keeps the Nuxt wiring in `stores/browser` (one `useState` container
per browser id) and `factories/browser` (events relayed onto the hook bus and
logger). `@zoobzio/foundation/services/browser` is removed — import
`BrowserService` from `@zoobzio/browser`. Type and constant import paths on
the layer are unchanged. The browser widget no longer inits the service on
mount — the caller drives `init()`, as the table widget does.
