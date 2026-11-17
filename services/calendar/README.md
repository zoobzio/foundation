# @zoobzio/calendar

Headless calendar service. Pure TypeScript, no framework dependency; its
entries are [JSCalendar](https://datatracker.ietf.org/doc/draft-ietf-calext-jscalendarbis/)
2.0, its recurrence runs on [rrule-temporal](https://github.com/ggaabe/rrule-temporal),
and its time on Temporal.

Owns: the view and the date it is anchored on, the range they span, the
entries the range loaded, the occurrences the entries recur into, the
selection, the commands that change an entry, one occurrence of it, or
an occurrence and every later one, and the query over the fields the
config declares. Delegates: data loading (`fetch`),
persistence (`save`), the entries' form (`read` and `write`), and state
storage (the container).

## Usage

```ts
import { CalendarService, createCalendarState, json } from "@zoobzio/calendar";

const config = { timeZone: "Europe/Amsterdam", firstDayOfWeek: "mo" };

const calendar = new CalendarService(
  "team",
  config,
  createCalendarState(config),
  {
    ...json,
    fetch: ({ range }) => api.entries(range.start, range.end),
    save: (mutation) => api.store(mutation.entries, mutation.removed),
  },
);

await calendar.init(); // fetches the range the view shows
calendar.occurrences; // every occurrence inside the range, by start
calendar.show("week");
calendar.next(); // moves the date, fetches the new range

await calendar.update(key, { title: "Moved" }); // one occurrence
await calendar.update(key, { duration: "PT2H" }, "following");
await calendar.remove(key, "all");
```

## The entries

The calendar's own form is JSCalendar: an `Event` or a `Task`, as plain
JSON. The package exports the whole format as types under `JSCalendar`:

```ts
import type { JSCalendar } from "@zoobzio/calendar";

const standup: JSCalendar.Event = {
  "@type": "Event",
  uid: "2a358cee-6489-4f14-a57f-c104db4dc2f2",
  updated: "2026-01-05T09:00:00Z",
  title: "Standup",
  start: "2026-01-05T09:30:00",
  timeZone: "Europe/Amsterdam",
  duration: "PT15M",
  recurrenceRule: {
    frequency: "weekly",
    byDay: [{ day: "mo" }, { day: "th" }],
  },
  recurrenceOverrides: {
    "2026-01-15T09:30:00": { start: "2026-01-15T11:00:00" },
    "2026-01-19T09:30:00": { excluded: true },
  },
};
```

The service reads what schedules an entry: `start`, `duration`, `due`,
`timeZone`, `showWithoutTime`, `recurrenceRule`, `recurrenceOverrides`,
and `recurrenceId`. Every other property, one the format does not define
included, is carried as it was found. The types follow
draft-ietf-calext-jscalendarbis-22, the revision of RFC 8984 in IETF Last
Call.

## Config

Plain data, except that a field's `values` may be a provider.

| Key              | Default        | Meaning                                                                      |
| ---------------- | -------------- | ---------------------------------------------------------------------------- |
| `views`          | all four       | The views offered: `month`, `week`, `day`, `agenda`                          |
| `view`           | first of views | The view a fresh container starts in                                         |
| `timeZone`       | `UTC`          | The zone the days are days of, a floating entry is placed in, today reads in |
| `locale`         | `en-US`        | The locale a view formats in                                                 |
| `firstDayOfWeek` | `mo`           | The day a week starts on                                                     |
| `fields`         | none           | The fields the query filters on, keyed by the identity a filter carries      |
| `literals`       | the query's    | The literals of the query; the `text` literal is the fetch's `query`         |
| `initialClauses` | none           | The clauses the query starts from                                            |
| `searchable`     | see below      | Whether a view renders the search: by default, with `fields` or `literals`   |

## Search

`calendar.query` is a [`@zoobzio/query`](../query/) service over the
config's `fields`: the model of an entry as a search reads it.

```ts
const config = {
  fields: {
    team: { label: "Team", values: ["Design", "Platform"] },
    status: { label: "Status", operators: ["is", "is not"] },
  },
};

// fetch: ({ range, query, filters }) => api.entries({ range, query, filters })

calendar.query.add({ kind: "filter", key: "team", value: "Design" });
```

The fetch is handed `{ range, query, filters }`: the range the view shows,
the committed free text, and the committed field filters. It answers with
the entries of the range that match them, a recurring one whole, as
before. The calendar gives a field, an operator, and the text no meaning,
and reads none of them off its entries: the window is the range, and the
search is whatever the backend makes of the rest. A change to the query's
clauses fetches the range again and emits `filtered`; a move of the view
or the date fetches the new range with the clauses as they stand.

## Views

`snapshot()` is the calendar as a visitor arranged it, `{ view, clauses }`,
and `restore(snapshot)` puts one in place in one fetch: the pair
[`@zoobzio/views`](../views/) reads and applies through. The date is not
part of it, so a saved view opens on the day the calendar stands on and a
step through time is not an edit of it. Before `init`, `restore` fetches
nothing: the first fetch reads what it left. A view the calendar does not
offer is left out, and so is a clause the query rejects; `snapshot` then
differs from what was restored.

## Occurrences

`occurrences` is every occurrence inside `range`, by start. An entry that
does not recur is its own occurrence; a recurring one gives one per
recurrence, from its rule and its overrides.

```ts
type Occurrence = {
  key: string; // the uid, joined with the recurrence id where the entry recurs
  uid: string;
  recurrenceId?: string;
  entry: JSCalendar.Entry; // the occurrence as a JSCalendar object
  start: string; // the instant it starts
  end: string;
  allDay: boolean;
};
```

An occurrence's `entry` is the entry with its override applied, its
`recurrenceId` set, and its rule and overrides left out: the object the
format defines for one instance of a recurring entry. A wall-clock time
holds across a clock change, a time inside a zone's gap or overlap reads
with the offset before the transition, and an entry with no `timeZone`
floats into the config's. A task spans its `start` to its `due`, or sits at
the one it names; a task with neither has no occurrence.

`occurrencesOn(day)` narrows them to the ones that touch one day of the
config's zone, so an occurrence that spans three days is on each.

The occurrences are read from the entries on read and kept until the
revision, the entries, the view, or the date moves.

## Commands

`create(entry)`, `update(key, patch, scope?)`, and `remove(key, scope?)`
change the entries at once, then persist through `save`. A patch is the
format's `PatchObject`: pointers to values, `null` to remove.

| Scope       | `update`                                                                 | `remove`                                    |
| ----------- | ------------------------------------------------------------------------ | ------------------------------------------- |
| `one`       | Writes the patch into the entry's `recurrenceOverrides`                  | Excludes the occurrence                     |
| `following` | Ends the entry's rule before the occurrence; adds the entry that follows | Ends the entry's rule before the occurrence |
| `all`       | Patches the entry                                                        | Removes the entry                           |

An entry that does not recur is always reached whole. A recurring one
defaults to `one`. `following` cuts the entry in two as the format
describes: the first keeps its `uid` and names the second as `next` in
`relatedTo`; the second takes a new `uid`, names the first as `first`, and
carries what is left of a `count`. Each keeps the overrides of its own
side; the second drops them when the patch moves its `start`.

`save` receives the mutation through the writer:

```ts
type Mutation<O> = { scope: Scope; entries: O; removed: O };
```

`entries` are stored, new or replaced by `uid`; `removed` are deleted. A
`save` that rejects puts the entries back and the rejection reaches the
caller of the command. Without `save` the change stays in the container.

## Readers and writers

A **reader** turns what `fetch` resolved, or what `load` was given, into
entries; a **writer** turns entries into the consumer's form. Both are
synchronous and receive the calendar's `context`, its time zone and
locale. The types are the kit's `Step` and `Codec`, bound to the
calendar's entries. The package carries one codec, `json`, the identity
over JSCalendar entries; the kit's `compose` chains a consumer's own steps
around it.

## The state container

```ts
createCalendarState(config); // plain: tests, Node
reactive(createCalendarState(config)); // Vue
```

The container holds the view, the date, the entries, the fetch flags, the
revision, the selected key, and the query's clauses, draft, and
suggestions. The entries are plain JSON, so the
container crosses SSR as it stands. The service is never wrapped by a
reactive proxy itself; its getters read the container, so a reactive
container tracks them.

## Middleware

`options.get.state.<field>` and `options.set.state.<field>` receive the
value of the field and return the value the service uses. A missing slot
passes the value on.

## Events

`on(event, listener)` subscribes. Listeners run in subscription order,
after the write lands. The return value removes the listener.

- `change`: a field of the container was written. `{ field, before, after }`.
- `navigated`: the view or the date moved. `{ id, view, date, range }`.
- `loaded`: a fetch settled, success or failure, or a source was loaded. `{ id, range, revision }`.
- `changed`: a command changed the entries and its save settled. `{ id, revision, mutation }`.
- `selected`: the selected occurrence changed. `{ id, key }`.
- `filtered`: the query's clauses changed. `{ id, query, filters }`.
- `restored`: a snapshot replaced the arrangement. `{ id, snapshot }`.
