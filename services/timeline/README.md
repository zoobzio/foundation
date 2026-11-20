# @zoobzio/timeline

Headless timeline service. Pure TypeScript, no framework dependency:
records in the order of their time, the latest first, loaded a batch at a
time and grouped under the day each falls on. A commit history, an audit
log, an activity feed.

Owns: the records loaded so far, the cursor of the batch after them, the
groups the records fall in, the selection, and the query over the fields
the config declares. Delegates: data loading (`fetch`) and state storage
(the container). A record is the consumer's own: the service reads its
key, its time, and its name by the properties the config names, and
carries the rest as it found it.

## Usage

```ts
import { TimelineService, createTimelineState } from "@zoobzio/timeline";

type Commit = { sha: string; message: string; author: string; at: string };

const config = { key: "sha", label: "message", limit: 30 } as const;

const history = new TimelineService<Commit>(
  "history",
  config,
  createTimelineState(config),
  {
    fetch: ({ cursor, limit }) => api.commits({ after: cursor, limit }),
  },
);

await history.init(); // fetches the first batch
history.groups; // [{ key: "2026-03-04", records: [...] }, ...]
history.more; // whether a batch follows

await history.loadMore(); // adds the next batch to the records
await history.fetch(); // starts over from the first
```

## Config

Plain data, except that a field's `values` may be a provider.

| Key              | Default     | Meaning                                                                    |
| ---------------- | ----------- | -------------------------------------------------------------------------- |
| `key`            | `id`        | The property that tells one record from another                            |
| `at`             | `at`        | The property that holds a record's time                                    |
| `label`          | the key     | The property a view reads as a record's name                               |
| `order`          | `desc`      | The way the records run: `desc` from the latest back, or `asc`             |
| `group`          | `day`       | What the records are grouped under: `day`, `month`, `year`, or `none`      |
| `limit`          | `30`        | How many records a batch asks for                                          |
| `timeZone`       | `UTC`       | The zone a record's day is a day of, and `today` is read in                |
| `locale`         | `en-US`     | The locale a view formats in                                               |
| `fields`         | none        | The fields the query filters on, keyed by the identity a filter carries    |
| `literals`       | the query's | The literals of the query; the `text` literal is the fetch's `query`       |
| `initialClauses` | none        | The clauses the query starts from                                          |
| `sync`           | off         | The sync's config: its `intervals`, and the `interval` it starts on        |
| `searchable`     | see below   | Whether a view renders the search: by default, with `fields` or `literals` |

A record's time is an ISO 8601 date-time, a count of milliseconds since
the epoch, or a `Date`. `keyOf(record)`, `timeOf(record)`, and
`labelOf(record)` read the three; `record(key)` finds one among the
records held.

## Batches

The fetch is handed `{ cursor, limit, query, filters }` and answers a
batch:

```ts
type FetchResult<T> = {
  data: T[]; // the records, in the order the timeline runs
  cursor?: string | null; // of the batch after them; none where there is none
  since?: string; // the mark the batch is whole as of, for the sync
};
```

The cursor is the backend's own: an offset, an id, a timestamp. It is
`null` for the first batch, and after that whatever the batch before
answered with. The timeline orders nothing a fetch answers.

- `init()` fetches the first batch once.
- `fetch()` fetches the records anew, from the first batch: what was
  loaded further down is let go.
- `loadMore()` fetches the batch after the records held and adds it to
  them, `appending` while it is out. It does nothing where `more` is
  `false`, before the first fetch, or while a fetch or another batch is
  out. A batch that comes back after the records were fetched anew is
  dropped, and a record already held is left out of it.
- `load(result)` replaces the records with a result, with no fetch.

A fetch that settles after a later one began is dropped, as every service
on the kit's loader drops one.

## Groups

`groups` is the records in the groups a view draws, each a run of records
that share a day, a month, or a year of the config's zone:

```ts
type Group<T> = {
  key: string; // "2026-03-04", "2026-03", or "2026"
  records: T[];
};
```

The groups follow the order of the records, and a group grows as a
further batch reaches into its day. With `group: "none"` there is one
group, keyed `""`, and a record whose time does not read as one is in a
group keyed `""` too. The groups are read from the records on read and
kept until the records change.

## Search

`timeline.query` is a [`@zoobzio/query`](../query/) service over the
config's `fields`. The fetch is handed the committed free text as `query`
and the committed field filters as `filters`, and answers with the
records that match them. The timeline gives a field, an operator, and the
text no meaning, and reads none of them off its records. A change to the
query's clauses fetches the records anew, from the first batch, and emits
`filtered`.

## Views

`snapshot()` is the timeline as a visitor arranged it,
`{ clauses, interval }`, and `restore(snapshot)` puts one in place in one
fetch: the pair [`@zoobzio/views`](../views/) reads and applies through.
How far down the records were loaded is not part of it. Before `init`,
`restore` fetches nothing: the first fetch reads what it left.

## Sync

With a `refresh` among its actions the timeline has a `sync`, a
[`@zoobzio/sync`](../sync/) service over its container, and a visitor may
keep the timeline alive on an interval. Without one `service.sync` is
`undefined`.

The refresh is handed what the fetch of the first batch is, and `since`,
the mark of the records held, and answers one of three ways:

```ts
// The records that are new or changed since the mark.
refresh: ({ since }) => api.commits({ since }),

// A cheap probe: `true` and the timeline fetches the first batch itself.
refresh: ({ since }) => api.changed(since),
```

Nothing, or `false`, keeps the records and the mark. Whatever comes back
is laid into the records held, by key, and not put in their place: a
record already held is replaced where it stands, a new one is placed by
its time, and what a visitor loaded further down, and the cursor after
it, stay. So a timeline kept alive grows at the top and does not lose its
place. A record the backend removed is not taken out; `fetch()` reads the
records anew.

## The state container

```ts
createTimelineState(config); // plain: tests, Node
reactive(createTimelineState(config)); // Vue
```

The container holds the records, the cursor, the fetch flags `loading`
and `appending`, the selected key, the query's clauses, draft, and
suggestions, and the sync's `interval`, `since`, and `syncing`. The
service is never wrapped by a reactive proxy itself; its getters read the
container, so a reactive container tracks them.

## Middleware

`options.get.state.<field>` and `options.set.state.<field>` receive the
value of the field and return the value the service uses. A missing slot
passes the value on.

## Events

`on(event, listener)` subscribes. Listeners run in subscription order,
after the write lands. The return value removes the listener.

- `change`: a field of the container was written. `{ field, before, after }`.
- `loaded`: a fetch settled, success or failure, a result was loaded, or a refresh landed records. `{ id, count, more }`.
- `appended`: a further batch joined the records. `{ id, count, added, more }`.
- `selected`: the selected record changed. `{ id, key }`.
- `filtered`: the query's clauses changed. `{ id, query, filters }`.
- `restored`: a snapshot replaced the arrangement. `{ id, snapshot }`.
