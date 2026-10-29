# @zoobzio/query

Headless query service. Pure TypeScript, no framework dependency.

Owns: the committed entries — one free-text entry and one filter per field
and operator, validated against the field schema — and a draft that a text
view composes an entry through.
Delegates: state storage (the container). A consumer reads `text` and
`filters` and reacts to `changed`.

## Usage

```ts
import { QueryService, createQueryState } from "@zoobzio/query";

const config = {
  fields: {
    status: { label: "Status", values: ["Active", "Inactive"] },
    amount: {
      label: "Amount",
      operators: ["over", "under", "is"],
      defaultOperator: "is",
    },
  },
};

const query = new QueryService("users", config, createQueryState());

query.add({ kind: "filter", key: "status", value: "Active" });
query.add({ kind: "text", value: "alice" });
query.filters; // [{ key: "status", value: "Active" }]
query.text; // "alice"
query.remove(0);
```

Any view drives the entries through `add`, `remove`, and `clear`. A filter
with the same key and operator replaces the one held and moves to the end;
a second text entry replaces the first.

## The draft

A text view composes an entry through the draft. The draft is the grammar
`Label: op: term`: `Label: term` is a field's value stage, `Label: op: term`
an operator field's, other text the field or free-text stage. `items`,
`trail`, `panels`, and `hint` derive from it. `select` enters a stage from a
panel option or commits a value. `submit` commits the term. `unwrap` takes
the last entry back into the draft.

```ts
query.setDraft("Amount: over: 4");
query.items; // the value panel
query.submit(); // add({ kind: "filter", key: "amount", op: "over", value: "4" })
```

A field's `values` is a list the term narrows, or a provider the term is
given to, so the list can be built from what is typed. A provider's result
stands as is.

`Field` and `Option` are interfaces, so a layer may widen them by
declaration merging. A field's properties beyond the ones the query reads
(an `icon`, say) are carried onto its option in the panel and the trail, so
a view that draws the field draws its option the same way. A field or
operator option enters a stage on `select`, and an `active` option is the
trail option whose stage the draft is in; a view may draw the first as a
branch and the second as an open one.

```ts
const config = {
  fields: {
    owner: { label: "Owner", values: (term) => users.search(term) },
  },
};
```

## The state container

The service reads and writes the `state` container: the entries and the
draft. The container can be a plain object or a reactive proxy.

```ts
createQueryState(); // plain: tests, Node
reactive(createQueryState()); // Vue
```

## Events

- `change`: a field of the container was written.
- `changed`: the committed entries changed. `{ id, entries }`.
