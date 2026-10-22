# packages/

Framework-free TypeScript packages. The headless services each own a data
machine and delegate data loading and state storage to the caller; the
mechanisms they share (the event emitter, the state container proxy, and their
types) live in [`@zoobzio/kit`](./kit/).

| Package                          | Description                                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [`@zoobzio/kit`](./kit/)         | Shared kit: typed event emitter, state container proxy, and their types                              |
| [`@zoobzio/query`](./query/)     | Query service: committed text and field filters over a field schema, plus a draft that composes them |
| [`@zoobzio/browser`](./browser/) | Browser service: folder trail navigation, file sort, selection, action joins                         |
| [`@zoobzio/chart`](./chart/)     | Chart service: variant, renderer, field and axis choice, bucket and range                            |
| [`@zoobzio/deck`](./deck/)       | Deck service: cursor feed, load-more, polling, sort, search, facets                                  |
| [`@zoobzio/form`](./form/)       | Form service: payload, per-key validation, touched tracking, submit lifecycle                        |
| [`@zoobzio/table`](./table/)     | Table service: paging, sort, selection, column order, search filters                                 |

Each package has its own README with usage, the state container contract,
middleware, and events. The layer's Nuxt wiring for each service lives in
`layers/foundation/app/stores/<name>.ts` and `factories/<name>.ts`; the table
and the form render through [`@zoobzio/vue`](../integrations/vue/).
