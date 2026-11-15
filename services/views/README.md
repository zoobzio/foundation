# @zoobzio/views

Headless saved views service. Pure TypeScript, no framework dependency.

A view is a named payload: the configuration of something else, a table or
a browser, saved to come back to. Owns: the list of views, which one is
active, whether the live payload has drifted from it, and the lifecycle
around them (select, save, save as, rename, remove, revert) with the
confirmation of whichever of those would lose something. Delegates: the
live payload itself (`read` and `apply`), the storage (`load`, `save`,
`remove`), and state storage (the container).

The service is not the source of truth for the payload. Whatever the views
are over keeps its own state; the views hold the payload each one was
saved with and compare.

## Usage

```ts
import { ViewsService, createViewsState } from "@zoobzio/views";
import { z } from "zod";

const config = {
  schema: z.object({
    sort: z.string().nullable(),
    pageSize: z.number(),
  }),
  views: [
    { id: "all", name: "All", payload: { sort: null, pageSize: 10 } },
    {
      id: "recent",
      name: "Recent",
      payload: { sort: "created", pageSize: 25 },
    },
  ],
};

const views = new ViewsService("orders", config, createViewsState(config), {
  read: () => grid.arrangement(),
  apply: (payload) => grid.arrange(payload),
  load: () => api.views(),
  save: (view) => api.saveView(view),
  remove: (view) => api.removeView(view.id),
});

await views.init(); // load the stored views, apply the active one
views.drifted; // false

grid.sortBy("total"); // the user edits the grid, not the view
views.drifted; // true

await views.saveAs("By total"); // a view of the user's own, now active
await views.select("recent"); // applies it: one `apply`
```

The payload type is inferred from the schema: `ViewsService<P>` takes a
`ZodType<P>`, and every view, `read`, `apply`, and event is typed by it.
`@zoobzio/table` and `@zoobzio/browser` each have a `snapshot()` and a
`restore()` made to be the `read` and the `apply`.

## Views

A view is `{ id, name, origin, payload }`. The `origin` says whose it is:

- `system`: the app's own, or one the user inherits. It can be selected
  and copied with `saveAs`; `save`, `rename`, and `remove` refuse it.
- `user`: the user's own. Everything applies; `editable` is `true` while
  one is active.

The config's `views` are `system` unless they say otherwise, and are there
before anything loads. `load` returns the stored ones as plain records.
Each is checked on the way in:

- a record without a string `id` and `name` is dropped;
- one under an id already held replaces it, so a backend can override an
  app view;
- one whose payload the schema rejects goes to `stale` and is never
  applied. A view saved before a column was renamed lands there. It can be
  removed, and is otherwise left for the app to migrate or show.

A stored record is `user` unless it says `system`. `config.initial` names
the view active at first; it defaults to the first.

## Drift

`drifted` is derived on each access: `read()`, through the schema, against
the active view's payload. Nothing is stored, so there is nothing to clear:
once the two match again, by a save, a revert, or the user undoing the
edit, it is `false`. It is `false` before `init` and with no active view.

Both sides go through the schema, so a default a payload leaves out is not
an edit. They compare with `same`, exported here: structural equality,
object keys in any order, arrays in theirs. `config.equals` replaces it,
for a payload where some difference should not count:

```ts
const config = {
  schema,
  // A resized column is not an edit worth a badge.
  equals: (a, b) => same({ ...a, sizing: {} }, { ...b, sizing: {} }),
};
```

For `drifted` to be reactive, `read` must read reactive state. Over a
container that is a reactive proxy, a `computed(() => views.drifted)`
tracks it.

`apply` and `read` must round-trip: after `apply(payload)`, `read()` must
return the same payload, or the view shows as edited the moment it is
selected.

## Confirmation

Three actions would lose something, so each is held as `pending` instead
of carried out, and `resolve` settles it:

| Action       | Held when               | `pending`                |
| ------------ | ----------------------- | ------------------------ |
| `select(id)` | the active view drifted | `{ kind: "select", id }` |
| `revert()`   | always (it has drifted) | `{ kind: "revert" }`     |
| `remove(id)` | always                  | `{ kind: "remove", id }` |

```ts
grid.sortBy("total");
await views.select("recent"); // false: held
views.pending; // { kind: "select", id: "recent" }

await views.resolve("save"); // save the edits, then select
await views.resolve("proceed"); // select, the edits are lost
await views.resolve("cancel"); // stay, the edits are kept
```

A view renders its dialog from `pending` and calls `resolve`. `save` is
for a held `select`. Where the active view is not the user's, it saves the
edits as a new view and needs its name: `resolve("save", "My view")`.

The save runs first. If it fails, the error is rethrown, the intent stays
pending, and the payload is as it was: nothing is applied over edits that
were not stored.

`{ force: true }` skips the hold, for code that has already asked or has
nothing to ask: `select(id, { force: true })`.

## The state container

`createViewsState(config)` builds the plain initial container:

```ts
{
  views, // View<P>[]
  stale, // View<unknown>[]: stored views the schema rejects
  active, // string | null
  pending, // Intent | null
  loading, // while `load` runs
  saving, // while `save` or `remove` runs
  initialized,
}
```

The service replaces each member as a whole, so a reactive proxy tracks
every change. It holds views and nothing of the live payload.

## Middleware

The fifth constructor argument takes per-field middleware over reads and
writes of the container, as every service of the kit does:

```ts
new ViewsService(id, config, state, wiring, {
  set: { state: { active: (id) => (remember(id), id) } },
});
```

## Events

`on(event, listener)` subscribes. Listeners run in subscription order, after
the write lands. The return value removes the listener.

- `change`: a field of the container was written. `{ field, before, after }`, narrowed by `field`.
- `initialized`: the stored views loaded and the active one was applied. `{ id, views }`.
- `selected`: the active view changed. `{ id, view, from }`, `from` the id it changed from.
- `saved`: a view was stored. `{ id, view, created }`, `created` for a new view.
- `renamed`: a view took a new name. `{ id, view }`.
- `removed`: a view was deleted. `{ id, view }`.
- `reverted`: the active view was applied over the edits. `{ id, view }`.
- `failed`: an action threw. `{ id, stage, cause }`, with `stage` one of
  `init`, `apply`, `save`, `rename`, `remove`. The error is rethrown to the
  caller after the event.

```ts
views.on("selected", ({ view }) => localStorage.setItem("view", view.id));
```
