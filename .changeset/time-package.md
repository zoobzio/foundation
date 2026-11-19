---
"@zoobzio/time": patch
"@zoobzio/calendar": patch
---

The time a calendar reads lives in a package of its own. `@zoobzio/time` is new: JSCalendar 2.0 as types (`JSCalendar`), the patch its entries change by (`patch`, `merge`, `overrides`, `overlaps`, `copy`), the recurrence they expand into over a range (`expand`, `recurs`, `ruleOf`, `instanceOf`, `keyOf`, with `Range`, `Occurrence`, and `Found`), and the zone arithmetic under both (`zoned`, `local`, `utc`, `normal`, `shift`, `stamp`), on Temporal and rrule-temporal. It holds no state and knows no view, so a second service over time reads the same entries the same way. The calendar is built on it and behaves as before; `JSCalendar`, `Occurrence`, and `Range` are still exported from `@zoobzio/calendar`.

Breaking: `CALENDAR_DEFAULT_SCALE`, `CALENDAR_FREQUENCIES`, `CALENDAR_SKIPS`, `CALENDAR_NO_DURATION`, `CALENDAR_OVERRIDE_FIXED`, and `CALENDAR_OVERRIDE_CLOSED` are no longer exported from `@zoobzio/calendar`: they are `@zoobzio/time`'s, as `TIME_*`.
