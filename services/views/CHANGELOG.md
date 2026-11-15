# @zoobzio/views

## 0.1.11

### Patch Changes

- Updated dependencies [[`a365fe4`](https://github.com/zoobzio/foundation/commit/a365fe4a423c09e6ec11aaaaea1cd46fa0c8e7c6)]:
  - @zoobzio/kit@0.1.11

## 0.1.10

### Patch Changes

- [`56e6d5b`](https://github.com/zoobzio/foundation/commit/56e6d5b4ecc0a8eb47eee18ad48c09f47d00a932) Thanks [@zoobzio](https://github.com/zoobzio)! - Saved views. `@zoobzio/views` is a new headless service: named payloads over a Zod schema the payload type is inferred from, the active view, and the lifecycle around them (`select`, `save`, `saveAs`, `rename`, `remove`, `revert`). It holds no live payload: `read` yields it and `apply` puts one in place, so a table or a browser stays the source of truth and `drifted` is the difference between what it holds and the active view. A view is the app's or inherited (`system`: select and copy only) or the user's own. An action that would lose something (a selection over unsaved edits, a revert, a removal) is held as `pending` until `resolve("save" | "proceed" | "cancel")`; a save that fails leaves the intent pending and the edits in place. A stored view the schema no longer accepts is set aside as `stale` and never applied.

  `@zoobzio/table` and `@zoobzio/browser` gain `snapshot()` and `restore(snapshot)`, and a `restored` event. A table's snapshot is its `sorting`, `columnOrder`, `columnVisibility`, and `columnSizing` slices, its `pageSize`, and the query's `entries`; a browser's is its `sortField`, `sortDirection`, and `entries`. A restore lands in one fetch, from the first page, and fetches nothing before `init`. `@zoobzio/query` gains `replace(entries)`, which commits a whole set of entries with one `changed`.

  The vue `views.vue` renders the service: the views as tabs, a mark on the active tab while it has drifted (`f-views-drifted` on the root, `f-views-badge` on the tab), the active view's actions in a menu beside them, and the dialogs that confirm a pending intent and name a view. `defineViews` and the `Views*` types come with it.

  The nuxt layer has `createViews(id, options)`, whose composable takes what the views are over (anything with a `snapshot` and a `restore`), `accessViews`, the `views:*` hooks, `TABLE_VIEW_SCHEMA` and `BROWSER_VIEW_SCHEMA` with their `TableView` and `BrowserView` types, and the `Views` component with its text under `views.*` in `@zoobzio/prose`. `createTable` and `createBrowser` relay `table:restored` and `browser:restored`.

- Updated dependencies []:
  - @zoobzio/kit@0.1.10
