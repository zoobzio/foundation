# @zoobzio/calendar

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
