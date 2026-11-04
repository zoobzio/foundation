---
"@zoobzio/query": patch
"@zoobzio/table": patch
---

`dateValues(timeZone, now)` of `@zoobzio/query` is a values provider for a field that filters on a date: it generates `YYYY-MM-DD` days from the term, so a visitor always has an option to pick as long as the term is date syntax. An empty term lists the last 31 days, today first, as the day reads in `timeZone`; a partial year narrows those; a full year lists its days newest first, 31 at most; a month lists its days; a partial day the days of the month that match; a complete day stands alone; and a day that does not exist, or a term that is not date syntax, lists nothing. Every option is a whole day, as choosing one commits the filter; years and months may lie in the future, and only the empty term looks back from today. `QUERY_DATE_VALUES_LIMIT` is the window and the cap. The table applies it by default to every `date` and `datetime` column that declares no `values` of its own, reading today in the config's `timeZone`; a column's own `values` replace it. The query machine, the autocomplete and the components change nothing: the provider is the seam `values` already offered.
