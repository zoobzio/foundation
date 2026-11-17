---
"@zoobzio/query": patch
"@zoobzio/table": patch
"@zoobzio/browser": patch
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
---

The query's committed entries are its clauses. Breaking: the `Entry` type is `Clause`, and `entries` is `clauses` on the query service, its state container, and its `changed` event; on the table's and the browser's containers and snapshots; and the table's `initialEntries` config is `initialClauses`. The autocomplete's chip slots are handed `clause` in place of `entry`, and `QueryEntry` is `QueryClause`. `TABLE_VIEW_SCHEMA` and `BROWSER_VIEW_SCHEMA` read a view stored under `entries` as its `clauses`; each is now a preprocess over its object, so an app that extends one extends its `out`.
