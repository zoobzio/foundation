# @zoobzio/sync

Headless sync service. Pure TypeScript, no framework dependency.

Owns: the interval a visitor sets, the mark of the last sync (`since`), and
the loop between them: wait the interval out, poll for what changed since
the mark, one poll at a time.
Delegates: the poll itself, and state storage (the container). It holds no
data: a service that loads something owns one, as the table, the browser,
and the calendar do, hands it the poll, and marks each load of its own.

## Usage

```ts
import { SyncService, createSyncState } from "@zoobzio/sync";

const sync = new SyncService("users-sync", {}, createSyncState(), {
  poll: async (since) => {
    const page = await api.users({ since }); // nothing where nothing changed
    if (!page) return;
    rows = page.rows;
    sync.mark(page.readAt);
  },
});

sync.mark(); // the first load landed: there is something to be newer than
sync.setInterval(30_000);
const stop = sync.watch(); // a view is on screen: poll every 30 seconds
stop(); // it left
```

## Since

`since` is the mark of the last sync: what the poll is handed, to ask what
changed after it. `mark(since)` sets it, and defaults to now, as an ISO
timestamp. The service never reads into it, so it is whatever the owner
marks: the visitor's clock, the server's own reading of its clock, a
version, a cursor. A poll that finds nothing leaves the mark where it is,
and the next asks from the same point.

A mark from the visitor's clock is compared against rows a server stamped
with its own, so the two clocks' drift is a window a change can fall into.
Where that matters, mark what the server answers with. The table and the
browser take it as the `since` of a fetch's result.

## The loop

Nothing polls unwatched. `watch()` opens a watch and returns the function
that ends it; while one is open and an interval is set, the service waits
the interval out and polls, then waits again from when the poll settles,
so a slow poll never overlaps the next. A view watches while it is on
screen, so a service built on a server, or one no view shows, keeps no
timer.

The wait starts over on every `mark`, so a load of the owner's own (a sort,
a search, a refresh by hand) puts the next poll a whole interval off; on
every `setInterval`; and after `poll()`, which polls at once whatever the
interval. Nothing polls before the first mark: there is nothing yet to
have changed since.

A poll that throws or rejects emits `failed`, and the service keeps its
pace.

## Intervals

`intervals` are the ones a visitor may pick from, in milliseconds, and
default to `SYNC_INTERVALS`: ten seconds, thirty, a minute, five. Off,
`SYNC_OFF`, is always there to pick. `setInterval` refuses any other, so
the list is also the floor on how hard a visitor can poll. `interval` in
the config is the one the sync starts on, off by default: nothing polls
until a visitor asks for it.

```ts
const config = { intervals: [5_000, 60_000], interval: 60_000 };
```

## The state container

The service reads and writes the `state` container: `interval`, `since`,
and `syncing`, whether a poll is out. The container can be a plain object
or a reactive proxy, and may be a slice of its owner's, as the query's is:
the table's, the browser's, and the calendar's containers carry the three fields beside
their own.

```ts
createSyncState(config); // plain: tests, Node
reactive(createSyncState(config)); // Vue
```

## Events

- `change`: a field of the container was written.
- `changed`: the interval changed. `{ id, interval }`.
- `synced`: a poll settled. `{ id, since }`, the mark it left.
- `failed`: a poll threw or rejected. `{ id, error }`.
