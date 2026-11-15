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
and so does a literal with the same key. `replace(entries)` commits a
whole set in place of the ones held, each checked as `add` checks it, and
emits `changed` once.

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

## Values providers

A provider is asked once per change of the draft, at the field's value
stage, and what it gives is held in `suggest`, where `items` reads it. It
gives a list, a page, or a promise of either, so it may ask an API:

```ts
const config = {
  fields: {
    owner: {
      label: "Owner",
      values: async (term, { signal, cursor }) => {
        const page = await users.search(term, { after: cursor, signal });
        return { values: page.names, next: page.after };
      },
    },
  },
};
```

Beside the term it is handed the lookup: the field `key`, the `op` the
draft names, a `signal`, and the `cursor`. A list is the whole of the
values. A page, `{ values, next }`, is the first of more: `next` is the
provider's own, an offset or a token, and `more()` asks again with it as
the `cursor`, adding the page's values to the options. `undefined` or
`null` ends the list. A value the options already hold is dropped, so a
list that shifts between pages repeats nothing.

`suggest` is `{ options, status, more }`. `status` is `loading` while the
first page of a term is out, `extending` while a further one is, and
`idle` once settled; `more` says whether `more()` has a page to add. While
a term loads, the options of the term before stay, as long as the field
and operator are the same, so a view does not flash empty between
keystrokes. A draft that moves on aborts the lookup's `signal` and its
result is dropped, so the options are always the last term's. A provider
that throws or rejects settles with what was held, no page to follow, and
a `failed` event.

`debounced(provider, ms)` waits before it asks, so a term typed through
asks once. A call for more asks at once.

```ts
values: debounced((term, { signal }) => users.search(term, { signal }), 200),
```

## Date values

`dateValues(timeZone, now?)` is a values provider for a field that filters
on a date: an unbounded, term-driven list of days, `YYYY-MM-DD`, so a
visitor always has an option as long as the term is date syntax. Every
option is a whole day, as choosing one commits the filter: the typed
prefix selects a range of days rather than drilling through years and
months. The days come a page at a time, 31 to the page, newest first, and
`more()` adds the next: a page names the one after it by its last day, so
the list runs on from there whatever the clock has done since. Today is
read in `timeZone`, from `now` on each first page.

| term                                          | options                                                |
| --------------------------------------------- | ------------------------------------------------------ |
| empty                                         | the days back from today, with no end                  |
| partial year, `2` or `202`                    | the days back from the latest it names, not past today |
| year, `2025` or `2025-`                       | the days of that year                                  |
| partial month, `2025-0`                       | the days of the months that match                      |
| month, `2025-03` or `2025-03-`                | the days of that month, in one page                    |
| partial day, `2025-03-1`                      | the matching days of that month                        |
| a complete day                                | that day alone                                         |
| a day that does not exist, or not date syntax | nothing                                                |

A partial year runs back from today while today's year is one it names,
and from the last day of the latest year it names once those are past:
`19` from `1999-12-31`. One that names only years to come lists nothing.
A full year or a month may lie in the future. `QUERY_DATE_VALUES_LIMIT`
is the size of a page.

```ts
const config = {
  fields: {
    created: { label: "Created", values: dateValues("America/New_York") },
  },
};
```

## The state container

The service reads and writes the `state` container: the entries, the
draft, and `suggest`, what a values provider has given for the draft. The
container can be a plain object or a reactive proxy. The service may
itself be held in a reactive proxy.

```ts
createQueryState(); // plain: tests, Node
reactive(createQueryState()); // Vue
```

## Events

- `change`: a field of the container was written.
- `changed`: the committed entries changed. `{ id, entries }`.
- `failed`: a values provider threw or rejected. `{ id, error }`.
