# @zoobzio/table

Headless data table service: a [TanStack Table](https://tanstack.com/table)
(`@tanstack/table-core`) over a state container, for rows a server filters,
sorts, and pages. Pure TypeScript, no framework dependency.

Owns: the container the table's state lives in, the loading of its rows,
the query over its columns (`@zoobzio/query`), and row and bulk actions.
Delegates: every table feature (paging, sorting, selection, column order,
visibility, and sizing) to TanStack Table, data loading to `fetch`, and
state storage to the container.

## Usage

```ts
import { TableService, createTableState } from "@zoobzio/table";

const config = {
  columns: [{ accessorKey: "name", meta: { label: "Name" } }],
  getRowId: (user) => user.id,
};

const users = new TableService("users", config, createTableState(config), {
  fetch: async (params) => api.users(params),
});

await users.init();
users.table.getColumn("name")?.toggleSorting();
users.query.add({ kind: "filter", key: "status", value: "active" });
```

## The table

`service.table` is the TanStack table: its columns, header groups, rows,
and cells, and the APIs of every registered feature. There is no second API
over it. A view renders from it (`getHeaderGroups()`, `getRowModel()`,
`row.getVisibleCells()`) and writes through it (`setPageIndex`,
`column.getToggleSortingHandler()`, `row.toggleSelected()`,
`setColumnOrder`, `column.toggleVisibility()`, `setColumnSizing`).

The config is the table's options as TanStack takes them: `columns`,
`getRowId`, `initialState`, `defaultColumn`, `maxMultiSortColCount`, and
any other but the ones the service sets itself (`features`, `data`,
`state`, `atoms`, `rowCount`, `pageCount`, `manualPagination`,
`manualSorting`) and the table-wide switches its `permissions` answer for
(`enableSorting`, `enableMultiSort`, `enableHiding`,
`enableColumnResizing`, and `enableRowSelection` as a boolean). Beside
them sit the service's own: `actions`, `bulkActions`, `permissions`,
`literals`, `initialEntries`, `locale`, `currency`, and `timeZone`.

The registered features are `features`, exported with its type `Features`:
row pagination, row sorting, row selection, column ordering, column
visibility, column sizing, and column resizing. An option, a state slice, or an API of a
feature exists once the feature is listed there. `TableInstance<T>`,
`TableColumnDef<T>`, `TableColumn<T>`, `TableHeader<T>`, `TableRow<T>`,
and `TableCell<T>` are TanStack's types bound to them.

What the defaults are is TanStack's to say. The ones a view meets first:

- A page is 10 rows.
- Every column that reads a value sorts; `enableSorting: false` on a
  column turns it off. The first sort of a column runs ascending for
  strings and descending for anything else, by the rows loaded. A third
  sort clears it. A sort with Shift held adds to the list.
- A column is 150 pixels wide, no narrower than 20, unless it or
  `defaultColumn` says (`size`, `minSize`, `maxSize`).
- Rows select when the config names bulk actions; `enableRowSelection`,
  a predicate over the row, says which. A selection outlives the page it
  was made on.
- A column with `enableHiding: false` stays visible, and one with
  `enableResizing: false` keeps its size.

## Permissions

`permissions` is the one gate over what a visitor may do with the table: a
record of booleans and nothing else, so the answers of whatever permission
model the app has drop straight in. `true` grants, `false` takes away, and
a permission left out is granted (`TABLE_DEFAULT_PERMISSIONS`).

```ts
const config = {
  columns,
  permissions: {
    bulkActions: user.can("orders.write"),
    hide: user.can("orders.arrange"),
    reorder: user.can("orders.arrange"),
  },
};
```

| Permission    | Without it                                                                        |
| ------------- | --------------------------------------------------------------------------------- |
| `search`      | A view renders no toolbar search. The query stays live.                           |
| `sort`        | No column sorts: `column.getCanSort()` is `false`.                                |
| `multiSort`   | A sort replaces the sort: `column.getCanMultiSort()` is `false`.                  |
| `select`      | No row selects: `row.getCanSelect()` is `false`.                                  |
| `actions`     | `service.actions` is empty and `runAction` runs nothing.                          |
| `bulkActions` | `service.bulkActions` is empty, `runBulkAction` runs nothing, and no row selects. |
| `hide`        | No column hides: `column.getCanHide()` is `false`.                                |
| `reorder`     | A write of the column order through the table is dropped.                         |
| `resize`      | No column resizes: `column.getCanResize()` is `false`.                            |
| `pageSize`    | A change of the page size through the table is dropped.                           |
| `refresh`     | A view renders no refresh. `fetch()` itself always fetches.                       |

`service.can(permission)` is the check, and the table's own answers follow
it, so a view that renders from `getCanSort()` or `getCanHide()` needs
nothing more. A permission only takes away: a column's own
`enableSorting: false` stands under a granted `sort`, and rows select only
with `select`, `bulkActions`, and bulk actions to run.

The service reads the record on every check and never copies it, so a
reactive record, or one whose members are getters, is followed as it
changes. A permission taken away stops the interaction and leaves the
state as it is: a sort already in place stays, and `restore` puts a
snapshot in place whatever the permissions say, so a saved view reads the
same for every visitor. The gate is over the interface only. What a
visitor must not see or do is the server's to refuse.

### The server's part

The server filters, sorts, and pages, so the table holds one page and
renders its rows as fetched. The fetch is handed the `pagination` and
`sorting` slices as the table holds them, and the search:

```ts
fetch({ pagination, sorting, query, filters }) {
  // pagination: { pageIndex: 0, pageSize: 10 }
  // sorting:    [{ id: "placed", desc: true }, { id: "total", desc: false }]
  // query:      "acme"
  // filters:    [{ key: "status", value: "Active" }]
  return { data: rows, rowCount: 137 };
}
```

`sorting` is an ordered list, as an `ORDER BY` is; an `id` is a column's
id. `rowCount` is the count of every row the search leaves, which the
table reads its page count from.

A write of `pagination` or `sorting` refetches, unless it changes nothing.
A sort stays on the page it was made on. A change of page size keeps the
top row in view. A change of the query's entries goes to the first page.

### Columns

A column is a TanStack column definition. What the service and its views
read beyond it sits on the column's `meta`:

```ts
const columns = [
  {
    accessorKey: "name",
    size: 240,
    meta: {
      label: "Name",
      type: "text",
      link: (row) => `/users/${row.id}`,
      operators: ["contains", "is"],
      defaultOperator: "contains",
    },
  },
  { accessorKey: "created", meta: { label: "Created", type: "date" } },
  { accessorKey: "owner", meta: { label: "Owner", values: owners.search } },
];
```

- `label`: the column's name, in its header and on its query field. Without
  one the column goes by its id.
- `type`: how a view renders the column's cells.
- `align`.
- `link`: the route of the column's cells. A view renders each cell of the
  column as a link to the route, with the cell's content inside.
- `filterable`, `operators`, `defaultOperator`, `values`: the column's
  query field, below.

`meta` is TanStack's `ColumnMeta` interface, widened by declaration
merging, so a layer may widen it further (an icon).

## Query

`service.query` is a query service over the filterable columns: one field
per column, keyed by its id, with the label, operators, default operator,
and values its `meta` declares. A column is filterable if it reads a value
and is not an `action` or an `image` one, or as its `meta.filterable` says. The table supplies no operators, as it gives an operator no
meaning: the consumer reads it from the filters its fetch is handed, so the
consumer names the vocabulary. A column that declares nothing is a bare
field, free entry and no operator stage, except a `date` or `datetime`
column, whose values default to the days the query's `dateValues` generates. Any view drives it: `add`, `remove`, `clear`,
or the draft a text view composes through. Free text is the query's
`text` literal, quoted in the draft, `"acme"`, and the field panel leads
with the option that opens the quote, labelled `Search`; the config's
`literals` replace the query's, so the option can be relabelled or a
literal added beside it. A change to its entries goes to the
first page, refetches, and emits `filtered`. The fetch params carry its
`text` as `query` and its `filters`. `initialEntries` in the config are the
entries it starts from.

```ts
users.query.add({ kind: "filter", key: "status", value: "Active" });
users.query.setDraft("Amount: over 40");
users.query.submit();
users.query.filters; // [{ key: "status", value: "Active" }, { key: "amount", op: "over", value: "40" }]
```

A property of a column's `meta` beyond the ones the table and its views
read is carried onto its field, so the search draws the field as the
column does; its `link` stays off the field.

### Date values

A `date` or `datetime` column that declares no `values` suggests days,
`YYYY-MM-DD`, generated from the term by the query's `dateValues`, so a
visitor filtering on a date always has an option as long as the term is
date syntax. Today is read in the config's `timeZone`. A column's own
`values` replace the days; `dateValues` is exported by `@zoobzio/query`,
so a column can wrap it. The generation rule is the query's to document.

A column's `values` may also be a provider that asks an API and gives its
values a page at a time; the query's README documents the contract. The
query emits `failed` when one throws or rejects: `users.query.on("failed", …)`.

## The state container

The service reads and writes the `state` container, and so does the table:
each slice of TanStack's state sits in it under TanStack's name
(`pagination`, `sorting`, `rowSelection`, `columnOrder`,
`columnVisibility`, `columnSizing`), beside the fetched page (`data`,
`rowCount`), `loading`, `initialized`, and the query's entries, draft, and
suggested values. The table holds no state of its own: every read of a
slice is a read of the container, so a write from anywhere (a hydrated
payload, another service over the same container) is what the table
renders next. The container can be a plain object or a reactive proxy.
Each member is replaced as a whole, so a proxy tracks every change, and it
is plain JSON, so a server payload carries it.

```ts
createTableState(config); // plain: tests, Node
reactive(createTableState(config)); // Vue
useState(`table-${id}`, () => createTableState(config)).value; // Nuxt, shared by id
```

`createTableState` starts each slice from TanStack's default under the
config's `initialState`, which is also what the table's resets
(`resetColumnOrder()`, `resetColumnSizing()`, `resetSorting()`) restore.

## Snapshot and restore

`snapshot()` is the table as a visitor arranged it, as plain data: the
`sorting`, `columnOrder`, `columnVisibility`, and `columnSizing` slices,
the `pageSize`, and the query's `entries`. The page index, the selection,
the rows, and the draft are not part of it. `restore(snapshot)` puts one
in place from the first page, in one fetch, where writing the slices one
at a time through the table would fetch per write. Before `init` it
fetches nothing, and the first fetch reads what it left.

```ts
const saved = table.snapshot();
table.table.setSorting([{ id: "total", desc: true }]);
table.restore(saved); // one fetch
```

The pair is what [`@zoobzio/views`](../views/) reads and applies a saved
view through. A restore gives back what it was given, with one exception:
the entries go through the query, so an entry it rejects is left out, and
a filter on a column with operators takes the default operator when it
names none. Save a filter with its operator.

## Middleware

`options.get.state.<field>` and `options.set.state.<field>` receive the value
of the field and return the value the service uses. A missing slot passes the
value on.

```ts
new TableService(id, config, state, wiring, {
  set: { state: { draft: (draft) => draft.trim() } },
});
```

## Events

`on(event, listener)` subscribes. Listeners run in subscription order, after
the write lands. The return value removes the listener.

- `change`: a field of the container was written, by the service or
  through the table. `{ field, before, after }`, narrowed by `field`.
- `updated`: a fetch settled. `{ id, rowCount }`.
- `filtered`: the query's entries changed. `{ id, query, filters }`.
- `restored`: a snapshot replaced the arrangement. `{ id, snapshot }`.

```ts
const off = table.on("change", (change) => {
  if (change.field === "pagination") track(change.after.pageIndex);
});
```
