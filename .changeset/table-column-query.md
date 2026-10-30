---
"@zoobzio/table": minor
"@zoobzio/browser": minor
"@zoobzio/vue": patch
---

A table column declares its own query vocabulary: `operators`, `defaultOperator`, and `values` (a list or a provider), named as the query's `Field` names them. The table supplies none from the column type, as it gives an operator no meaning: the consumer reads it from the filters its fetch is handed. A column that declares nothing is a bare field, free entry and no operator stage. `enumValues` is gone: a column's `values` is the one list. The operator constants (`TABLE_OPERATORS`, `TABLE_DEFAULT_OPERATORS`, and the date and number lists) are gone with them. The browser column drops its unused `enumValues` as well.
