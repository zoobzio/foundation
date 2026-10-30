---
"@zoobzio/table": patch
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
---

A table column's properties beyond the ones the table reads are carried through: `fields` puts them on the column's query field, and the vue table's `columnOption` puts them on the column manager's option. The nuxt layer widens `DataTableColumn` with `icon?: IconAlias`, so a column's `icon` draws before its header (the wrapper's default `headerPrepend`), beside its field in the search, and beside its option in the column manager.
