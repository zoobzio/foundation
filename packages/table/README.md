# @zoobzio/table

Headless data table service. Pure TypeScript, no framework dependency.

Owns: paging, sort, row selection, column order, committed search (query + filters).
Delegates: data loading (`fetch`) and state storage (the container).

## Usage

```ts
import { TableService, createTableState } from "@zoobzio/table";

const config = { columns: [{ key: "name", label: "Name" }], rowKey: "id" };

const table = new TableService("users", config, createTableState(config), {
  fetch: async (params) => api.users(params),
});

await table.init();
table.sortBy("name");
table.addFilter("status", "active");
```

## The state container

The service reads and writes the `state` container: paging, sort, selection,
column order, and the committed search. The container can be a plain object or
a reactive proxy. The service replaces each member as a whole, so a proxy
tracks every change.

```ts
createTableState(config); // plain: tests, Node
reactive(createTableState(config)); // Vue
useState(`table-${id}`, () => createTableState(config)).value; // Nuxt, shared by id
```

## Middleware

`options.get.state.<field>` and `options.set.state.<field>` receive the value
of the field and return the value the service uses. A missing slot passes the
value on.

```ts
new TableService(id, config, state, wiring, {
  set: { state: { query: (query) => query.trim() } },
});
```

## Events

`on(event, listener)` subscribes. Listeners run in subscription order, after
the write lands. The return value removes the listener.

- `change`: a field of the container was written. `{ field, before, after }`, narrowed by `field`.
- `updated`: a fetch settled. `{ id, total }`.
- `filtered`: the committed query or filters changed. `{ id, query, filters }`.

```ts
const off = table.on("change", (change) => {
  if (change.field === "page") track(change.after);
});
```
