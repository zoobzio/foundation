---
"@zoobzio/query": patch
"@zoobzio/table": patch
"@zoobzio/browser": patch
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
"@zoobzio/prose": patch
---

A field's values provider may ask an API, and gives its values a page at a time. `@zoobzio/query` asks a provider once per change of the draft, at the value stage, rather than on every read of `items`, and holds what it gives in a new member of the container, `suggest`: `{ options, status, more }`. A provider gives a list, a page (`{ values, next }`), or a promise of either, and is handed the lookup beside the term: the field `key`, the `op`, an `AbortSignal`, and the `cursor`. `more()` asks for the page after the last while the provider names one, and adds its values to the options. `status` is `loading` for the first page of a term and `extending` for a further one; the options of the term before stay while the next loads on the same field and operator. A draft that moves on aborts the lookup and drops its result. A provider that throws or rejects emits the new `failed` event. `debounced(provider, ms)` wraps a provider so a term typed through asks once. `Provider`, `Page`, `Lookup`, `Suggest`, and `SuggestStatus` are new types; the service gains `suggest` and `more`.

Breaking for a consumer of `dateValues`: it returns a page, `{ values, next }`, where it returned a list, and `QUERY_DATE_VALUES_LIMIT` is the size of a page where it was a cap. The days no longer stop at 31: an empty term runs back from today with no end, and a year lists all its days. A partial year runs back from the latest day it can start rather than narrowing the last 31 days, so `19` lists from `1999-12-31` where it listed nothing. A year below 1000 reads as itself, `0099-12-31`.

Breaking for a container built by hand: `State` of the query, the table, and the browser gains `suggest`, which `createQueryState`, `createTableState`, and `createBrowserState` seed.

The vue `autocomplete.vue` asks for more as the visitor nears the end of a provider's options, by scroll or by key: a sentinel (`f-autocomplete-sentinel`) lies over the last of them, `AUTOCOMPLETE_MORE_LEAD` deep, and is watched while it is on screen. The viewport of the active panel needs a height to bound it, as before; without one the options load until they run off the page. New slots: `loading`, in place of the options while a first page is out and none are held, and `more`, after the options while a further page is out. The content carries `aria-busy` through either, and an item's `aria-setsize` is `-1` while more remain. Fixed: the default `empty` state rendered under the options whenever `empty` was set; it now renders once the panel has none.

The texts of the autocomplete's panel are named: `AUTOCOMPLETE_EMPTY_TEXT`, `AUTOCOMPLETE_LOADING_TEXT`, and `AUTOCOMPLETE_MORE_TEXT` in the vue package, and the nuxt wrapper reads the `empty`, `loading`, and `more` states from the contract, so they follow the visitor's locale. New in the prose contract: `autocomplete.empty`, `autocomplete.loading`, and `autocomplete.more`.
