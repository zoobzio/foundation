# @zoobzio/time

The time the headless services share. Pure TypeScript, no framework
dependency: [JSCalendar](https://datatracker.ietf.org/doc/draft-ietf-calext-jscalendarbis/)
2.0 as types, the patch its entries change by, the recurrence they expand
into over a range, on [rrule-temporal](https://github.com/ggaabe/rrule-temporal),
and the zone arithmetic under both, on Temporal.

A service over time holds JSCalendar entries and reads them through this
package, as [`@zoobzio/calendar`](../../services/calendar/) does. It
holds no state and knows no view: what a service shows of time, and how it
moves through it, is the service's own.

## The format

`JSCalendar` is the whole format as types, after
draft-ietf-calext-jscalendarbis-22: `Event`, `Task`, `Entry`,
`RecurrenceRule`, `PatchObject`, and the rest.

```ts
import type { JSCalendar } from "@zoobzio/time";

const standup: JSCalendar.Event = {
  "@type": "Event",
  uid: "2a358cee-6489-4f14-a57f-c104db4dc2f2",
  updated: "2026-01-05T09:00:00Z",
  title: "Standup",
  start: "2026-01-05T09:30:00",
  timeZone: "Europe/Amsterdam",
  duration: "PT15M",
  recurrenceRule: { frequency: "weekly", byDay: [{ day: "mo" }] },
};
```

## Occurrences

`expand(entries, range, zone)` is every occurrence of the entries inside a
`Range`, by start, each with the place of its entry in `entries`: a
`Found`, `{ occurrence, source }`. An entry that does not recur is its own
occurrence where its span meets the range; a recurring one gives one per
recurrence, from its rule and its overrides. An entry with no `timeZone`
floats into `zone`.

```ts
import { expand } from "@zoobzio/time";

const found = expand(
  [standup],
  { start: "2026-01-01T00:00:00Z", end: "2026-02-01T00:00:00Z" },
  "UTC",
);
found[0]?.occurrence; // { key, uid, recurrenceId, entry, start, end, allDay }
```

- `recurs(entry)`: whether an entry recurs.
- `ruleOf(rule, start)`: a JSCalendar rule as the rrule-temporal rule the
  expansion runs.
- `instanceOf(entry, recurrenceId)`: one occurrence of a recurring entry as
  a JSCalendar object, its override applied.
- `keyOf(uid, recurrenceId?)`: an occurrence's key.

## Patches

A patch is the format's `PatchObject`: pointers to values, `null` to
remove.

- `patch(target, changes)`: a copy of the target with the patch applied,
  whole or not at all.
- `merge(earlier, later)`: two patches to one object as one.
- `overrides(changes)`: whether a patch may stand in
  `recurrenceOverrides`.
- `overlaps(a, b)`: whether one pointer leads to or through the other.
- `copy(value)`: a copy as plain JSON, whatever proxy the value is read
  through.

## Edits

A change to the entries, worked out and not yet made: an `Edit` is
`{ scope, entries, stored, removed }`, the entries as they stand after it,
the ones to store, and the ones to delete. A service applies it and
persists it.

- `createEntry(entries, entry)`: adds an entry.
- `updateEntry(entries, found, key, changes, scope, editing)`: patches an
  occurrence (`one`, into the entry's `recurrenceOverrides`), an occurrence
  and every later one (`following`, cutting the entry in two as the format
  describes), or the whole entry (`all`).
- `removeEntry(entries, found, key, scope, editing)`: excludes an
  occurrence, ends the rule before it, or removes the entry.

`found` is the expansion the key is read from, and `editing` what the edit
reads of its owner: `{ zone, now, uid }`. An entry that does not recur is
always reached whole; a recurring one defaults to `one`.

## Zones

The format's two spellings of a time, a `LocalDateTime` and a
`UTCDateTime`, and Temporal between them.

- `zoned(local, zone)`: a local date-time in a zone. A time inside a
  zone's gap or overlap reads with the offset before the transition.
- `local(value)`, `utc(value)`: a zoned date-time as a local date-time or
  an instant, to the second.
- `normal(value)`: a local date-time in the one spelling the services
  compare by.
- `shift(value, from, to)`: a local date-time moved by the wall-clock
  distance between two others.
- `stamp(now)`: a `Date` as an instant, to the second.

## Days

A `Day` is a calendar day, `YYYY-MM-DD`, as it reads in a zone.

- `dayOf(now, zone)`: the day an instant falls on in a zone.
- `day(value)`: a day in its one spelling; throws for a value that is not
  one.
- `weekStart(date, first)`: the first day of the week a `Temporal.PlainDate`
  falls in, where weeks start on `first`.
