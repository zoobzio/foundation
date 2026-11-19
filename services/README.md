# services/

Framework-free headless services. Each one owns a data machine and delegates
data loading and state storage to the caller; the mechanisms they share (the
event emitter, the state container proxy, and their types) live in
[`@zoobzio/kit`](../packages/kit/).

| Package                            | Description                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [`@zoobzio/query`](./query/)       | Query service: committed text and field filters over a field schema, plus a draft that composes them  |
| [`@zoobzio/sync`](./sync/)         | Sync service: a polling interval a visitor sets, the mark of the last sync, the loop that polls since |
| [`@zoobzio/browser`](./browser/)   | Browser service: folder trail navigation, file sort, selection, search, action joins                  |
| [`@zoobzio/form`](./form/)         | Form service: payload, per-key validation, touched tracking, submit lifecycle                         |
| [`@zoobzio/table`](./table/)       | Table service: a TanStack Table over a state container, server paging and sort, search filters        |
| [`@zoobzio/editor`](./editor/)     | Editor service: one rich text document over tiptap, a feature set, commands, json/html/hast codecs    |
| [`@zoobzio/code`](./code/)         | Code service: one text document over CodeMirror, history, the consumer's extensions, text codec       |
| [`@zoobzio/calendar`](./calendar/) | Calendar service: JSCalendar entries over a range, recurrence, occurrences, scoped changes            |
| [`@zoobzio/views`](./views/)       | Views service: saved payloads over a Zod schema, the active view, drift from it, save and delete      |

Each service has its own README with usage, the state container contract,
middleware, and events. The editor and the code service are the two backed
by a dependency: the editor owns a tiptap editor with no DOM, and its codecs
turn the documents a consumer holds into the editor's and back; the code
service owns a CodeMirror state with no view, and the consumer's own
CodeMirror extensions decide language, theme, and keymaps. The calendar
holds JSCalendar entries and expands their recurrence through
rrule-temporal, and searches through a query over the fields its config
declares. The table, the browser, and the calendar keep what they hold alive
through a sync, where their wiring names a `refresh` to poll. The views hold no payload of their own: they sit over a table,
a browser, or a calendar, whose `snapshot` and `restore` they read and
apply through. The table, the
form, the browser, the calendar, and the views render through [`@zoobzio/vue`](../integrations/vue/),
and their Nuxt wiring lives in [`@zoobzio/nuxt`](../integrations/nuxt/) as
`stores/<name>.ts` and `factories/<name>.ts`.
