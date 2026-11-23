# @zoobzio/calendar

## 0.1.13

### Patch Changes

- [`d37dab6`](https://github.com/zoobzio/foundation/commit/d37dab630a8df85e577b0fcb34ce3412aea40ea0) Thanks [@zoobzio](https://github.com/zoobzio)! - The order between a service's fetches and its sync's refreshes lives in the kit. `makeLoader(state, actions)` is the loader a table, a browser, and a calendar each wrote for themselves: `init`, `fetch`, the quiet `refresh` a sync polls, and `load`, with the types `LoaderState`, `LoaderActions<P, R>`, `Loader<R>`, and `Refreshed<R>`. The calendar behaves as before.

  Fixed: a table's or a browser's fetch that settles after a later one began is dropped, as a calendar's already was. Before, the slower response of two landed last, whichever was asked for last, and the first to settle cleared `loading` while the other was still out. A dropped fetch lands nothing and emits no `updated`; its rejection still reaches its caller. A refresh that comes back after a fetch began and failed is dropped too.

- [`26dc3e5`](https://github.com/zoobzio/foundation/commit/26dc3e5ce4ac8ddaff69d7d365a72f7dada65d1f) Thanks [@zoobzio](https://github.com/zoobzio)! - A table, a browser, and a calendar keep themselves up to date. `@zoobzio/sync` is a new headless service: the interval a visitor sets, the mark of the last sync (`since`), and the loop that polls for what changed since, while a view watches. A service whose wiring names a `refresh` has one as `service.sync`, over its own container, which gains `interval`, `since`, and `syncing`. The refresh is handed the fetch's params and `since`, and answers nothing (unchanged), `true` (fetch again), or what the fetch would as it now stands; a table's or a browser's result may name its own `since`. The Vue table, browser, and calendar render the refresh as the trigger of a menu, the `syncMenu` part, where the service has a sync: refresh now, or the interval to keep alive on. `createTable`, `createBrowser`, and `createCalendar` take `refresh`, and `accessBrowser` a third argument, the config whose `sync` sets the interval the browser starts on. Without a `refresh` the button fetches as before.

  Breaking: every `Snapshot` carries `interval`, the sync's, so a saved view keeps the pace it was saved with, and `restore` sets it. `TABLE_VIEW_SCHEMA`, `BROWSER_VIEW_SCHEMA`, and `CALENDAR_VIEW_SCHEMA` read it, off where a stored view names none; an app with a view schema of its own adds the member.

- [`8d33940`](https://github.com/zoobzio/foundation/commit/8d339402d55c8f1c2b722c616ebd2c1dc1f5ccce) Thanks [@zoobzio](https://github.com/zoobzio)! - The time a calendar reads lives in a package of its own. `@zoobzio/time` is new: JSCalendar 2.0 as types (`JSCalendar`), the patch its entries change by (`patch`, `merge`, `overrides`, `overlaps`, `copy`), the recurrence they expand into over a range (`expand`, `recurs`, `ruleOf`, `instanceOf`, `keyOf`, with `Range`, `Occurrence`, and `Found`), the scoped edits a command makes (`createEntry`, `updateEntry`, `removeEntry`, with `Scope`, `Edit`, and `Editing`), the days (`dayOf`, `day`, `weekStart`, with `Day`), and the zone arithmetic under them all (`zoned`, `local`, `utc`, `normal`, `shift`, `stamp`), on Temporal and rrule-temporal. It holds no state and knows no view. The calendar is built on it and behaves as before; `JSCalendar`, `Occurrence`, `Range`, `Day`, and `Scope` are still exported from `@zoobzio/calendar`.

  Breaking: `CALENDAR_DEFAULT_SCALE`, `CALENDAR_FREQUENCIES`, `CALENDAR_SKIPS`, `CALENDAR_NO_DURATION`, `CALENDAR_OVERRIDE_FIXED`, and `CALENDAR_OVERRIDE_CLOSED` are no longer exported from `@zoobzio/calendar`: they are `@zoobzio/time`'s, as `TIME_*`.

- Updated dependencies [[`d37dab6`](https://github.com/zoobzio/foundation/commit/d37dab630a8df85e577b0fcb34ce3412aea40ea0), [`26dc3e5`](https://github.com/zoobzio/foundation/commit/26dc3e5ce4ac8ddaff69d7d365a72f7dada65d1f), [`8d33940`](https://github.com/zoobzio/foundation/commit/8d339402d55c8f1c2b722c616ebd2c1dc1f5ccce)]:
  - @zoobzio/kit@0.1.13
  - @zoobzio/sync@0.1.13
  - @zoobzio/time@0.1.13
  - @zoobzio/query@0.1.13

## 0.1.12

### Patch Changes

- [`3494a66`](https://github.com/zoobzio/foundation/commit/3494a669729827097a9e222763f62f873e19c995) Thanks [@zoobzio](https://github.com/zoobzio)! - The calendar searches and saves views. Its config declares the `fields` (and `literals`, `initialClauses`) of a query the service holds as `query`; a change to the clauses refetches the range and emits `filtered`. `snapshot()` and `restore()` hold `{ view, clauses }`, so the views sit over a calendar as over a table, through `CALENDAR_VIEW_SCHEMA`. Breaking: `fetch` is handed `{ range, query, filters }` where it was handed the range. The Vue calendar renders the search in its toolbar where the service is `searchable`, and the Nuxt layer dresses it and relays `calendar:filtered` and `calendar:restored`.

- Updated dependencies [[`86c4cd2`](https://github.com/zoobzio/foundation/commit/86c4cd25d1ae20e20f7f7d91c2da607a241da05b)]:
  - @zoobzio/query@0.1.12
  - @zoobzio/kit@0.1.12

## 0.1.11

### Patch Changes

- Updated dependencies [[`a365fe4`](https://github.com/zoobzio/foundation/commit/a365fe4a423c09e6ec11aaaaea1cd46fa0c8e7c6)]:
  - @zoobzio/kit@0.1.11

## 0.1.10

### Patch Changes

- [`90104a6`](https://github.com/zoobzio/foundation/commit/90104a693b6b06ee5ba99edec470dbf617c523c7) Thanks [@zoobzio](https://github.com/zoobzio)! - A calendar. `@zoobzio/calendar` is a new headless service over JSCalendar 2.0 entries (draft-ietf-calext-jscalendarbis-22), events and tasks as plain JSON, exported as types under `JSCalendar`. It owns the view (`month`, `week`, `day`, `agenda`), the date, the range they span, the entries the range loaded, and the occurrences they recur into: a rule expands through rrule-temporal, overrides add, change and exclude occurrences, a wall-clock time holds across a clock change, and each occurrence is a JSCalendar object of its own. `fetch(range)` loads through the reader; `create`, `update(key, patch, scope)` and `remove(key, scope)` change an entry, one occurrence (`one`, into `recurrenceOverrides`), or an occurrence and every later one (`following`, the entry cut in two with `relatedTo` between them), and persist through `save`, which puts the entries back when it rejects. It emits `navigated`, `loaded`, `changed`, and `selected`. The vue `calendar.vue` renders it (`defineCalendar`, the `Calendar*` types, `useCalendar`, the `f-data-calendar-*` classes): a toolbar built from the service as the editor's is, one tool per command in groups inside reka's toolbar (`today`, `prev`, `next`, then a toggle per view), with the `tool` part, the `tool`, `toolPrepend`, `toolLabel`, and `toolAppend` slots per tool, and `toolbarPrepend` and `toolbarAppend` for a consumer's own controls, over a table of the view's days, or the agenda's list, each day with the occurrences that touch it. The nuxt layer adds `createCalendar`, `accessCalendar`, the `calendar:*` hooks, and a wrapper that names each tool in the visitor's locale and draws `prev` and `next` as icons by the tool's key (`CALENDAR_TOOL_ICONS`, `CALENDAR_TOOL_TEXT`), with the rest of its text in the visitor's locale (`calendar.today`, `calendar.previous`, `calendar.next`, `calendar.month`, `calendar.week`, `calendar.day`, `calendar.agenda`, `calendar.untitled`, `calendar.empty`, new in the prose contract).

- Updated dependencies []:
  - @zoobzio/kit@0.1.10
