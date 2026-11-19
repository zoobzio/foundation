---
"@zoobzio/sync": patch
"@zoobzio/table": patch
"@zoobzio/browser": patch
"@zoobzio/calendar": patch
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
"@zoobzio/prose": patch
---

A table, a browser, and a calendar keep themselves up to date. `@zoobzio/sync` is a new headless service: the interval a visitor sets, the mark of the last sync (`since`), and the loop that polls for what changed since, while a view watches. A service whose wiring names a `refresh` has one as `service.sync`, over its own container, which gains `interval`, `since`, and `syncing`. The refresh is handed the fetch's params and `since`, and answers nothing (unchanged), `true` (fetch again), or what the fetch would as it now stands; a table's or a browser's result may name its own `since`. The Vue table, browser, and calendar render the refresh as the trigger of a menu, the `syncMenu` part, where the service has a sync: refresh now, or the interval to keep alive on. `createTable`, `createBrowser`, and `createCalendar` take `refresh`, and `accessBrowser` a third argument, the config whose `sync` sets the interval the browser starts on. Without a `refresh` the button fetches as before.

Breaking: every `Snapshot` carries `interval`, the sync's, so a saved view keeps the pace it was saved with, and `restore` sets it. `TABLE_VIEW_SCHEMA`, `BROWSER_VIEW_SCHEMA`, and `CALENDAR_VIEW_SCHEMA` read it, off where a stored view names none; an app with a view schema of its own adds the member.
