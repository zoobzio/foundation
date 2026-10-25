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
- `change(field, before, after)`: builds one change object.
- `compose(a, b, …)`: chains steps into one. Each step takes the value and
  the service's context; a step that needs no context takes one argument.
- The types the above are described in: `Middleware<S>`, `Options<S>`,
  `Fields<S>`, `Changes<S>`, `Change<S, K>`, `Changers<S>`, `ChangeEvents<S>`,
  `EventMap`, `Emitter<M>`, `Listener<M, E>`, `Listeners<M>`, `Step<A, B, C>`,
  `Codec<I, D, O, C>`.

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
