# @zoobzio/deck

Headless data deck service. Pure TypeScript, no framework dependency.

Owns: the cursor feed, load-more (older), polling (newer, buffered as
pending), sort field, committed search (query + keywords + match + facets).
Delegates: data loading (`fetch`), state storage (the container), and timers
(`poll()` is one step; the caller owns the interval).

## Usage

```ts
import { DeckService, createDeckState } from "@zoobzio/deck";

const config = {
  topic: "contacts",
  rowKey: "id",
  dateFields: [{ key: "created", label: "Created" }],
};

const deck = new DeckService("contacts", config, createDeckState(config), {
  fetch: async (params) => api.contacts(params),
});

await deck.init();
await deck.loadMore(); // fetch with `before` = oldest cursor
await deck.poll(); // fetch with `after` = newest cursor → pending
deck.showPending(); // pending → front of the feed
deck.setQuery("alice");
```

## The state container

The service reads and writes the `state` container: the feed, the pending
buffer, the load flags, and the committed search. The container can be a
plain object or a reactive proxy. The service replaces each member as a
whole, so a proxy tracks every change.

```ts
createDeckState(config); // plain: tests, Node
reactive(createDeckState(config)); // Vue
useState(`deck-${id}`, () => createDeckState(config)).value; // Nuxt, shared by id
```

## Middleware

`options.get.state.<field>` and `options.set.state.<field>` receive the value
of the field and return the value the service uses. A missing slot passes the
value on.

```ts
new DeckService(id, config, state, wiring, {
  set: { state: { query: (query) => query.trim() } },
});
```

## Events

`on(event, listener)` subscribes. Listeners run in subscription order, after
the write lands. The return value removes the listener.

- `change`: a field of the container was written. `{ field, before, after }`, narrowed by `field`.
- `updated`: a fetch settled. `{ id, count }` — the feed length.
- `polled`: a poll found newer items. `{ id, count }` — the number found.
- `failed`: a poll threw; the error is not rethrown. `{ id, cause }`.

```ts
const off = deck.on("polled", ({ count }) => notify(`${count} new`));
```
