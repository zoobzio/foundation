# @zoobzio/kit

The mechanisms the headless services share. Pure TypeScript, no framework
dependency.

- `makeEmitter<M>()`: a typed event bus over an event map. `on` subscribes and
  returns the unsubscribe, `emit` calls listeners in subscription order over a
  copy, `heard` reports whether an event has a listener.
- `makeProxy(state, fields, options, emitter)`: the active state over a
  container. A read of a field passes through `options.get.state.<field>`, a
  write through `options.set.state.<field>`, then lands in the container and
  emits `change` with `{ field, before, after }`. A key outside `fields` goes
  straight to the container.
- `makeLoader(state, actions)`: the loader of a service that holds what a
  fetch answered: `init`, `fetch`, the quiet `refresh` a sync polls, and
  `load`. It owns the order between them; see below.
- `change(field, before, after)`: builds one change object.
- `compose(a, b, …)`: chains steps into one. Each step takes the value and
  the service's context; a step that needs no context takes one argument.
- The types the above are described in: `Middleware<S>`, `Options<S>`,
  `Fields<S>`, `Changes<S>`, `Change<S, K>`, `Changers<S>`, `ChangeEvents<S>`,
  `EventMap`, `Emitter<M>`, `Listener<M, E>`, `Listeners<M>`, `Step<A, B, C>`,
  `Codec<I, D, O, C>`, `LoaderState`, `LoaderActions<P, R>`, `Loader<R>`,
  `Refreshed<R>`.

Everything is generic over the container shape `S`. A service binds them to
its own `State<T>` and re-exports the bound aliases, so a consumer of
`@zoobzio/table` never imports from the kit directly.

A `Codec<I, D, O, C>` is the seam a service opens at its boundary: `read`
takes a source in the consumer's form `I` to the service's own form `D`,
`write` takes `D` to the consumer's form `O`, and each step receives the
service's context `C`. A service binds `D` and `C` and ships its codecs;
`compose` chains a consumer's own steps before or after one.

## Usage

```ts
import { makeEmitter, makeProxy } from "@zoobzio/kit";
import type { ChangeEvents, Fields, Options } from "@zoobzio/kit";

type State = { page: number; query: string };

const FIELDS: Fields<State> = { page: null, query: null };

type Events = ChangeEvents<State> & { updated: [event: { id: string }] };

const emitter = makeEmitter<Events>();
const options: Options<State> = {
  set: { state: { query: (query) => query.trim() } },
};
const state = makeProxy({ page: 1, query: "" }, FIELDS, options, emitter);

emitter.on("change", (change) => {
  if (change.field === "page") track(change.after);
});

state.query = " acme "; // stored as "acme", emits change
```

## The loader

A service that loads (a table, a browser, a calendar) hands its container
and its seams to `makeLoader` and keeps the promises every one of them
makes:

```ts
const loader = makeLoader<Params, Result>(state, {
  params: () => ({ page: state.page }), // what the fetch is handed
  fetch: (params) => api.rows(params),
  refresh: (params, since) => api.rowsSince(params, since), // optional
  land: (result, at) => {
    state.rows = result.rows;
    sync.mark(result.since ?? at); // `at`: when the request was made
  },
  settled: (params) => emitter.emit("updated", { id }),
  busy: () => saving > 0, // optional: work a refresh must not land over
  version: () => state.revision, // optional: moves when the owner changes
});
```

- `init()` fetches once, where the container was not `initialized`.
- `fetch()` holds `loading`, lands the result, and is `settled`, success or
  failure. One that settles after a later one began is dropped: it lands
  nothing, leaves `loading` to the later one, and is not `settled`. Its
  rejection still reaches its caller.
- `refresh(since)` is the poll of a sync. It is quiet, `loading` being the
  fetch's alone, and asks nothing before the first fetch, while one is
  out, or while the owner is `busy`. The answer is a `Refreshed<R>`:
  nothing or `false` keeps what is held, `true` fetches again, and a
  result lands as a fetch's does. One that comes back to an owner that has
  moved on since (a fetch began, the mark moved, the owner is busy, its
  `version` changed) is dropped.
- `load(result)` lands a result the owner was handed, with no fetch, and
  drops a fetch that is out.

The container carries `loading`, `initialized`, and `since` among its
fields (`LoaderState`); the loader writes the first two and reads the
third, and the result and the mark are the owner's to write, in `land`.
