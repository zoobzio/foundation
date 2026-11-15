# @zoobzio/browser

Headless data browser service. Pure TypeScript, no framework dependency.

Owns: the folder trail (open a folder, jump to a crumb), the file sort,
the selection of files and folders, the query over its columns, and the join of action
descriptors to their handlers.
Delegates: data loading (`fetch`) and state storage (the container).
Folders list above files; the order of each is the fetch's.

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
browser.toggleFolder("media");
browser.runAction("download", file); // dispatch a file action by key
browser.runBulkAction("purge"); // a bulk action over the selection
```

## Folders

A folder is `{ key, label, count?, values? }`. Its label renders in the
first column, and `values` is what it shows in the others, keyed by column and formatted as a file's value is: a total in
bytes under a `filesize` column, a latest change under a `date` one. A
column the folder carries no value for is an empty cell. `count` is a
badge beside the label.

```ts
fetch: async (params) => ({
  folders: [{ key: "media", label: "Media", values: { size: 48_200_000 } }],
  files,
});
```

Folders render in the order the fetch returns them, as files do. The
fetch is handed the sort, so it can order the folders by it too, by label
under the first column and by their `values` under the others.

## Selection

Declaring a bulk action is what makes the rows selectable (`isSelectable`),
folders and files alike. The file keys are in `selected` (`toggleRow`,
`isRowSelected`), the folder keys in `selectedFolders` (`toggleFolder`,
`isFolderSelected`): two sets, as a folder's key and a file's may be the
same. `toggleAll`, `selectAllState`, `hasSelection`, `selectionCount`, and
`clearSelection` read and write both, and a bulk handler is handed both:

```ts
bulkActions: {
  purge: (selected, folders) => api.purge([...selected], [...folders]),
}
```

The selection is the current listing's. `open` and `navigate` drop it, and
each fetch that settles keeps only the keys it still lists, so a bulk
action never reaches a row a search or a refresh took out of view. A fetch
that fails leaves it as it stands.

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
flags, the trail, the file sort, the selection (`selected` and
`selectedFolders`), and the query's `entries`,
`draft`, and `suggest`. The container can be a
plain object or a reactive proxy. The service replaces each member as a
whole, so a proxy tracks every change.

```ts
createBrowserState(); // plain: tests, Node
reactive(createBrowserState()); // Vue
useState(`browser-${id}`, () => createBrowserState()).value; // Nuxt, shared by id
```

## Snapshot and restore

`snapshot()` is the browser as a visitor arranged it, as plain data:
`sortField`, `sortDirection`, and the query's `entries`. The trail, the
listing, the selection, and the draft are not part of it.
`restore(snapshot)` puts one in place in the folder the browser stands in,
in one fetch; before `init` it fetches nothing. The pair is what
[`@zoobzio/views`](../views/) reads and applies a saved view through. The
entries go through the query, so one it rejects is left out.

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
- `restored`: a snapshot replaced the arrangement. `{ id, snapshot }`.

```ts
const off = browser.on("navigated", ({ path }) => history.push(path));
```
