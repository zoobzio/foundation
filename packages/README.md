# packages/

Framework-free TypeScript packages. The headless services each own a data
machine and delegate data loading and state storage to the caller; the
mechanisms they share (the event emitter, the state container proxy, and their
types) live in [`@zoobzio/kit`](./kit/).

| Package                          | Description                                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [`@zoobzio/kit`](./kit/)         | Shared kit: typed event emitter, state container proxy, codec and compose, and their types           |
| [`@zoobzio/query`](./query/)     | Query service: committed text and field filters over a field schema, plus a draft that composes them |
| [`@zoobzio/browser`](./browser/) | Browser service: folder trail navigation, file sort, selection, action joins                         |
| [`@zoobzio/form`](./form/)       | Form service: payload, per-key validation, touched tracking, submit lifecycle                        |
| [`@zoobzio/table`](./table/)     | Table service: paging, sort, selection, column order, search filters                                 |
| [`@zoobzio/editor`](./editor/)   | Editor service: one rich text document over tiptap, a feature set, commands, json/html/hast codecs   |

Each package has its own README with usage, the state container contract,
middleware, and events. The editor is the one service backed by a
dependency: it owns a tiptap editor with no DOM, and its codecs turn the
documents a consumer holds into the editor's and back. The table, the form, and the browser render through
[`@zoobzio/vue`](../integrations/vue/), and their Nuxt wiring lives in
[`@zoobzio/nuxt`](../integrations/nuxt/) as `stores/<name>.ts` and
`factories/<name>.ts`.
