---
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
---

The month grids that pick a date are renamed, so `calendar` is free for the calendar service: `calendar.vue` is `date-grid.vue` and `range-calendar.vue` is `date-range-grid.vue`, with their definitions (`defineDateGrid`, `defineDateRangeGrid`), their types (`DateGrid*`, `DateRangeGrid*`, under `types/components/date-grid` and `types/components/date-range-grid`), their classes (`f-date-grid-*`, `f-date-range-grid-*`), and their context ids (`date-grid`, `date-range-grid`; the range grid's was `calendar` too). The nuxt layer's wrappers and its `#components` names follow (`DateGrid`, `DateRangeGrid`). The date filters keep their `calendar` and `rangeCalendar` parts and their `calendar` slots.
