# @zoobzio/table

Headless data table service. Pure TypeScript, no framework dependency.

Owns: paging, sort, row selection, column order, and the query over its
columns (`@zoobzio/query`).
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
table.query.add({ kind: "filter", key: "status", value: "active" });
```

## Query

`table.query` is a query service over the filterable columns: one field per
column, with the operators, default operator, and values the column
declares. The table supplies none, as it gives an operator no meaning: the
consumer reads it from the filters its fetch is handed, so the consumer
names the vocabulary. A column that declares nothing is a bare field, free
entry and no operator stage. Any view drives it: `add`, `remove`, `clear`,
or the draft a text view composes through. Free text is the query's
`text` literal, quoted in the draft, `"acme"`, and the field panel leads
with the option that opens the quote, labelled `Search`; the config's
`literals` replace the query's, so the option can be relabelled or a
literal added beside it. A change to its entries resets the page,
refetches, and emits `filtered`. The fetch params carry its `text` as
`query` and its `filters`.

```ts
table.query.add({ kind: "filter", key: "status", value: "Active" });
table.query.setDraft("Amount: over 40");
table.query.submit();
table.query.filters; // [{ key: "status", value: "Active" }, { key: "amount", op: "over", value: "40" }]
```

A column declares what its field offers.

```ts
const columns = [
  {
    key: "created",
    label: "Created",
    type: "date",
    operators: ["before", "after", "on", "between"],
  },
  {
    key: "name",
    label: "Name",
    type: "text",
    operators: ["contains", "is"],
    defaultOperator: "contains",
  },
  { key: "owner", label: "Owner", values: (term) => owners.search(term) },
  { key: "amount", label: "Amount", type: "currency" }, // free entry, no operator stage
];
```

## The state container

The service reads and writes the `state` container: paging, sort, selection,
column order, and the query's entries and draft. The container can be a
plain object or a reactive proxy. The service replaces each member as a
whole, so a proxy tracks every change.

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
- `filtered`: the query's entries changed. `{ id, query, filters }`.

```ts
const off = table.on("change", (change) => {
  if (change.field === "page") track(change.after);
});
```
