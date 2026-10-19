---
"@zoobzio/chart": minor
"@zoobzio/foundation": minor
---

Extract the data chart service into the headless `@zoobzio/chart` package.
The service, its state container factory, domain types, domain constants, and
the pure variant helpers (`buildVariants`, `resolveChartDefaults`,
`aggregateBreakdown`) now live there with no framework dependency; chart.js
stays on the layer, in `utils/chart` (the render helpers). A renderer's
`options` is typed `object` in the package and rendered as chart.js options
by the layer. The service reads and writes a plain state container through
optional get/set middleware and emits `change`, `updated`, `variantChanged`,
and `rendererChanged` through its own `on` listeners. The layer keeps the
Nuxt wiring in `stores/chart` (one `useState` container per chart id) and
`factories/chart` (events relayed onto the hook bus and logger).
`@zoobzio/foundation/services/chart` is removed — import `ChartService` from
`@zoobzio/chart`. Type and constant import paths on the layer are unchanged.
The chart widget no longer inits the service on mount — the caller drives
`init()`, as the table widget does.
