# @zoobzio/browser

Headless data browser service. Pure TypeScript, no framework dependency.

Owns: the folder trail (open a folder, jump to a crumb), the file sort,
the file selection, the query over its columns, and the join of action
descriptors to their handlers.
Delegates: data loading (`fetch`) and state storage (the container).
Folders always come back alphabetical; file order is the fetch's.

The package defines its own column and action shapes (`BrowserColumn`,
`ActionDescriptor`, `FileAction`, `FolderAction`, `BulkAction`,
`SortDirection`); its query is a [`@zoobzio/query`](../query/) machine.

## Usage

```ts
import { BrowserService, createBrowserState } from "@zoobzio/browser";

const config = {
  columns: [{ key: "name", label: "Name", sortable: true }],
  fileKey: "id",
  actions: { download: { label: "Download" } },
};

const browser = new BrowserService("assets", config, createBrowserState(), {
  fetch: async (params) => api.assets(params), // { folders, files }
  actions: { download: (file) => save(file) },
});

await browser.init();
browser.open({ key: "media", label: "Media" }); // descend, refetch
browser.navigate(0); // back to the root
browser.sortBy("name"); // asc, then desc on repeat
browser.toggleRow("1");
browser.runAction("download", file); // dispatch a file action by key
browser.runBulkAction("purge"); // a bulk action over the selection
```

## The trail

`trail` is the breadcrumb from the root: the root crumb (`rootLabel`,
default `Home`) followed by one crumb per step of `path`. Each crumb's key
is its joined path prefix, so keys stay unique when one folder key recurs
at several depths, and a crumb's index in `trail` is what `navigate` takes.

```ts
browser.trail; // [{ key: "", label: "Home" }, { key: "media", label: "Media" }]
browser.navigate(browser.trail.findIndex((c) => c.key === "media"));
```

## The search

`query` is a query machine over the filterable columns: one field per
column, with the `operators`, `defaultOperator`, and `values` the column
declares, as a table's columns do. Every column is filterable but an
`action` or `image` one, unless its `filterable` says otherwise. A change
to the query's entries refetches the current folder and emits `filtered`;
the fetch is handed the committed free text as `query` and the column
filters as `filters`, beside the `path` they were typed in.

```ts
browser.query.add({ kind: "literal", key: "text", value: "logo" });
// fetch({ path: ["media"], sortField, sortDirection, query: "logo", filters: [] })
```

A search belongs to the folder it was typed in: `open` and `navigate` drop
its entries and its draft, in the one fetch the move makes. So a fetch that
matches within `path` searches the current folder; how far below `path` it
reaches, and whether it matches folders, is the fetch's to decide. Under
`isFiltered` a settled `isEmpty` is a search with no match rather than an
empty folder. `searchable: false` hides the search in a view and leaves
`query` live.

`sortableColumns` are the columns that declare `sortable`: what a view
lists as its sort options, each sorting through `sortBy(sortFieldFor(col))`.

## The state container

The service reads and writes the `state` container: the listing, the load
flags, the trail, the file sort, the selection, and the query's `entries`
and `draft`. The container can be a
plain object or a reactive proxy. The service replaces each member as a
whole, so a proxy tracks every change.

```ts
createBrowserState(); // plain: tests, Node
reactive(createBrowserState()); // Vue
useState(`browser-${id}`, () => createBrowserState()).value; // Nuxt, shared by id
```

## Middleware

`options.get.state.<field>` and `options.set.state.<field>` receive the value
of the field and return the value the service uses. A missing slot passes the
value on.

```ts
new BrowserService(id, config, state, wiring, {
  set: { state: { sortField: (field) => field?.toLowerCase() ?? null } },
});
```

## Events

`on(event, listener)` subscribes. Listeners run in subscription order, after
the write lands. The return value removes the listener.

- `change`: a field of the container was written. `{ field, before, after }`, narrowed by `field`.
- `updated`: a fetch settled, success or failure. `{ id, path, folders, files }` — the key trail and section lengths.
- `navigated`: the trail changed through `open` or `navigate`. `{ id, path }`.
- `filtered`: the query's entries changed, by the search or by leaving the folder it was typed in. `{ id, query, filters }`.

```ts
const off = browser.on("navigated", ({ path }) => history.push(path));
```
