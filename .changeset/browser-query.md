---
"@zoobzio/browser": patch
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
"@zoobzio/prose": patch
"@zoobzio/icons": patch
---

The browser searches and sorts from its toolbar, and its trail is the head of its listing. `@zoobzio/browser` holds a `query`, a `@zoobzio/query` machine over its filterable columns as the table's is: a column declares `filterable`, `operators`, `defaultOperator`, and `values`, the config `searchable` and `literals`, and the container gains the query's `entries` and `draft`. A change to the entries refetches the current folder and emits `filtered`; the fetch is handed `query` and `filters` beside `path`. A search belongs to the folder it was typed in, so `open` and `navigate` drop it in the one fetch the move makes: a fetch that matches within `path` searches the current folder. `sortableColumns`, `filterableColumns`, and `isFiltered` are new on the service.

The vue `browser.vue` toolbar is now the search (the `search` part and slot, an autocomplete over the query), a sort menu over the sortable columns (the `sortMenu` and `sortTrigger` parts, the `sort`, `sortPrepend`, and `sortAppend` slots; the sorted item carries `data-current` and `data-direction`), and the refresh. The breadcrumb leaves the toolbar for a head on the table, the new `browser-head.vue` (`BrowserHead*` types, `f-data-browser-head`): the select-all checkbox, which the browser had no place for, then one cell with the trail and the listing's counts (`summary` slot, `f-data-browser-summary`), with `crumbPrepend` and `crumbAppend` around a crumb's label. It relays `filtered`.

Breaking for a consumer of the view: the breadcrumb's passthrough moves from `pt.breadcrumb` to `pt.head.breadcrumb`, `BrowserCrumbItem` is declared in `types/components/browser-head`, the `breadcrumb` slot's scope is the head's context, and the `toolbar` slot no longer wraps the trail. The table and its head now stay over a settled empty folder, so the `empty` slot fills a cell of a `tbody.f-data-browser-empty` rather than replacing the table, and its default reads `No matches` under a search.

The nuxt wrapper draws the search as the table's (`TableSearch`), `sort` on the sort trigger until the files sort by a column and `sort-asc` or `sort-desc` after, as on that column's menu item, and `folder-open` before the root crumb; `sort` and `folder-open` are new aliases of `@zoobzio/icons`. `createBrowser` relays `browser:filtered`, takes `entries` in `initial`, and labels the text literal from the contract. A browser column takes an `icon`, drawn in the search and the sort menu. New in the prose contract: `browser.search`, `browser.text`, `browser.sort`, `browser.summary`, and `browser.noMatches`.
