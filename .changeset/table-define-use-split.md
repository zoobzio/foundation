---
"@zoobzio/foundation": patch
---

Table: complete the define/use split — the definition is now strictly
serializable and all functional wiring attaches in setup.

Selection drops the `K` generic and stores stringified row keys: `selected`
is `Set<string>`, `keyOf` returns `String(row[rowKey])`, and every table
type is single-generic over the row.

`defineEntity<T>()` is the new authoring entry: it binds the entity type
once and yields definers scoped to it, so each definer stays generic over
its definition alone and record keys survive as literals. Its `defineTable`
returns a flat `TableDefinition<T>` — columns, rowKey, action/bulk
descriptor records (`{ icon, label }` keyed by action id), pinned/order,
and a static `pt` base — stamped with the phantom `Stamp<T>` (`$contract`)
so `useTable` infers `T` from the definition itself.

`useTable(id, definition, wiring)` owns the behavior: `fetch` (required),
`actions`/`bulkActions` handler records keyed to the definition's
descriptor vocabulary (required exactly when descriptors exist, rejected
when they don't), and a reactive `pt` override merged over the definition's
base per key. The service joins descriptors to handlers by key into the
same fused shape the view already renders, so components and view
composables are untouched.

Deck follows the same split: `defineDeck` on the entity yields a flat
stamped `DeckDefinition<T>` (topic, rowKey, dateFields, polling/page
config, pt base), and `useDeck(id, definition, wiring)` takes `fetch` and
the reactive pt override. Deck has no action records, so its wiring is
`T`-generic only.

Preview follows the same split: `definePreview` on the entity yields a
flat stamped `PreviewDefinition<T>` (fields, content variant, pt base),
and `usePreview(id, definition, wiring)` takes `fetch` and the reactive pt
override.

Chart follows the same split: `defineChart` on the entity yields a flat
stamped `ChartDefinition<T>` (topic, variant configs, color map, pt base),
and `useChart(id, definition, wiring)` takes one fetcher per declared
variant — required exactly when that variant's config exists, rejected
when it doesn't — plus the reactive pt override.

Form follows the same split, with one deliberate scope call: the Zod
schema travels with the definition — it is the form's intrinsic contract,
not wiring — so `defineForm` on the entity yields a flat stamped
`FormDefinition<T>` (title, fields, schema, defaults, pt base).
`useForm(id, definition, wiring?)` takes the optional init/submit
lifecycle, per-key middleware, and the reactive pt override; the wiring
argument is omittable for local-only forms. Autocomplete migrates in a
later release.
