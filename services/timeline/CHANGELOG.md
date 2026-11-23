# @zoobzio/timeline

## 0.1.13

### Patch Changes

- [`48bf6a7`](https://github.com/zoobzio/foundation/commit/48bf6a7597b23cf7d12f352aa7309d00e4d998e1) Thanks [@zoobzio](https://github.com/zoobzio)! - `@zoobzio/timeline` is a new headless service: records in the order of their time, the latest first, as a commit history or an activity feed reads. A record is the consumer's own; the config names the properties that hold its `key`, its time (`at`), and its `label`. The fetch is handed `{ cursor, limit, query, filters }` and answers a batch with the cursor of the one after it: `init` and `fetch` read from the first, and `loadMore` adds the next to the records held, `appending` while it is out, dropped where the records were fetched anew in the meantime. `groups` is the records under the day, the month, or the year each falls on in the config's zone. With it come the query over the config's fields, `snapshot` and `restore` for saved views, the selection, and, where the wiring names a `refresh`, a sync whose refresh is laid into the records held by key, so a timeline kept alive grows at the top and keeps what was loaded further down.

  The Vue `timeline.vue` renders one: the search and the refresh over a list of groups, each a heading over its records, a card per record with a button that selects it and its time, and the button that loads the next batch. The `record` slot draws a consumer's own card; `recordPrepend`, `recordLabel`, `recordTime`, and `recordAppend` fill the default one. `useTimeline` is its view model, `defineTimeline` its definition. The Nuxt layer adds `createTimeline` and `accessTimeline`, the `timeline:*` hooks, `TIMELINE_VIEW_SCHEMA` and `TimelineView` for saved views, and the wrapped `Timeline`, in the visitor's locale from the new `timeline.*` messages of the prose contract.

- Updated dependencies [[`d37dab6`](https://github.com/zoobzio/foundation/commit/d37dab630a8df85e577b0fcb34ce3412aea40ea0), [`26dc3e5`](https://github.com/zoobzio/foundation/commit/26dc3e5ce4ac8ddaff69d7d365a72f7dada65d1f)]:
  - @zoobzio/kit@0.1.13
  - @zoobzio/sync@0.1.13
  - @zoobzio/query@0.1.13
