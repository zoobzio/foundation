---
"@zoobzio/table": minor
"@zoobzio/foundation": minor
---

Extract the data table service into the headless `@zoobzio/table` package. The
service, its state container factory, domain types, and domain constants now
live there with no framework dependency. The service reads and writes a plain
state container through optional get/set middleware and emits `change`,
`updated`, and `filtered` through its own `on` listeners. The layer keeps the
Nuxt wiring in `stores/table` (one `useState` container per table id) and
`factories/table` (events relayed onto the hook bus and logger).
`@zoobzio/foundation/services/table` is removed — import `TableService` from
`@zoobzio/table`. Type and constant import paths on the layer are unchanged.
