# @zoobzio/query

Headless query service. Pure TypeScript, no framework dependency.

Owns: the committed entries — one entry per literal and one filter per
field and operator, validated against the config — and a draft that a text
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
query.add({ kind: "literal", key: "text", value: "alice" });
query.filters; // [{ key: "status", value: "Active" }]
query.text; // "alice"
query.remove(0);
```

Any view drives the entries through `add`, `remove`, and `clear`. A filter
with the same key and operator replaces the one held and moves to the end,
and so does a literal with the same key.

## The draft

A text view composes an entry through the draft. The draft is the grammar
`Label: op term` or `open term close`: `Label: term` is a field's value
stage, `Label: op term` an operator field's, a draft that opens with a
literal's `open` the literal stage, and other text the field stage, a
label being named. An operator is read once its space is typed, so
`Amount: ov` is still the operator stage. A chip's label is the text that
made it. `items`, `trail`, `panels`, and `hint` derive from it. `select`
enters a stage from a panel option or commits a value. `submit` commits
the term. `unwrap` takes the last entry back into the draft.

```ts
query.setDraft("Amount: over 4");
query.items; // the value panel
query.submit(); // add({ kind: "filter", key: "amount", op: "over", value: "4" })
```

## Literals

A literal is a value written between its own characters, with no stage to
suggest from: a label for its option, and the `open` and `close` that
delimit it. The config's `literals` are keyed as its fields are, by the
identity a literal entry carries, and default to the text literal alone:
`text`, free text between quotes under `Search`, the one `text` reads.
Free text is quoted so a word that is also a field's label is never taken
for one.

The field panel leads with the literal options while nothing is typed.
Selecting one writes its `open` before the term typed so far. The literal
stage is terminal: it suggests nothing and adds no trail, so `panels` is
empty while the literal is typed and a panel view has nothing to show.
Typing the `close` commits the literal at once, as Enter does an unclosed
one. A bare term submits nothing: it names a field still. With
`literals: {}` there is no literal option and a quote is a character.

```ts
query.setDraft('"ali'); // the literal stage: no items, no trail
query.setDraft('"alice"'); // add({ kind: "literal", key: "text", value: "alice" }); the draft clears
```

A literal's `open` and `close` may differ, and may be longer than one
character; the longest `open` the draft starts with wins. `textFor` of a
literal entry is its value between the characters, the string `labelFor`
gives and `unwrap` hands back minus the last character.

```ts
const config = {
  fields,
  literals: {
    ...QUERY_LITERALS,
    tag: { label: "Tag", open: "(", close: ")" },
  },
};
```

A field's `values` is a list the term narrows, or a provider the term is
given to, so the list can be built from what is typed. A provider's result
stands as is.

`Field`, `Literal`, and `Option` are interfaces, so a layer may widen them
by declaration merging. A field's or literal's properties beyond the ones
the query reads (an `icon`, say) are carried onto its option in the panel,
and a field's into the trail, so a view that draws the field draws its
option the same way. A field or operator option enters a stage on
`select`, and an `active` option is the trail option whose stage the draft
is in; a view may draw the first as a branch and the second as an open
one. A literal option is terminal, so a view draws it as neither.

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
