---
"@zoobzio/kit": patch
"@zoobzio/table": patch
"@zoobzio/browser": patch
"@zoobzio/calendar": patch
---

The order between a service's fetches and its sync's refreshes lives in the kit. `makeLoader(state, actions)` is the loader a table, a browser, and a calendar each wrote for themselves: `init`, `fetch`, the quiet `refresh` a sync polls, and `load`, with the types `LoaderState`, `LoaderActions<P, R>`, `Loader<R>`, and `Refreshed<R>`. The calendar behaves as before.

Fixed: a table's or a browser's fetch that settles after a later one began is dropped, as a calendar's already was. Before, the slower response of two landed last, whichever was asked for last, and the first to settle cleared `loading` while the other was still out. A dropped fetch lands nothing and emits no `updated`; its rejection still reaches its caller. A refresh that comes back after a fetch began and failed is dropped too.
