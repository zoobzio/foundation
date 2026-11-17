---
"@zoobzio/calendar": patch
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
"@zoobzio/prose": patch
---

The calendar searches and saves views. Its config declares the `fields` (and `literals`, `initialClauses`) of a query the service holds as `query`; a change to the clauses refetches the range and emits `filtered`. `snapshot()` and `restore()` hold `{ view, clauses }`, so the views sit over a calendar as over a table, through `CALENDAR_VIEW_SCHEMA`. Breaking: `fetch` is handed `{ range, query, filters }` where it was handed the range. The Vue calendar renders the search in its toolbar where the service is `searchable`, and the Nuxt layer dresses it and relays `calendar:filtered` and `calendar:restored`.
