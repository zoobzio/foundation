# packages/

Headless packages the layer wires into Nuxt. Pure TypeScript, no framework
dependency; each one owns a data machine and delegates data loading and state
storage to the caller.

| Package                          | Description                                                                   |
| -------------------------------- | ----------------------------------------------------------------------------- |
| [`@zoobzio/browser`](./browser/) | Browser service: folder trail navigation, file sort, selection, action joins  |
| [`@zoobzio/chart`](./chart/)     | Chart service: variant, renderer, field and axis choice, bucket and range     |
| [`@zoobzio/deck`](./deck/)       | Deck service: cursor feed, load-more, polling, sort, search, facets           |
| [`@zoobzio/form`](./form/)       | Form service: payload, per-key validation, touched tracking, submit lifecycle |
| [`@zoobzio/preview`](./preview/) | Preview service: one record fetched and read by field                         |
| [`@zoobzio/table`](./table/)     | Table service: paging, sort, selection, column order, search filters          |

Each package has its own README with usage, the state container contract,
middleware, and events. The layer's Nuxt wiring for each lives in
`layers/foundation/app/stores/<name>.ts` and `factories/<name>.ts`.
