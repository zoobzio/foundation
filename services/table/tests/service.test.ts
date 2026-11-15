// Constructor-injected seams — a plain state container, a vi.fn() Actions
// fake, and vi.fn() listeners. The table is TanStack's, so nothing here
// tests what it computes: every test drives the service's own part — the
// container as the owner of the table's state, the fetch a write causes,
// the query, the actions, the events.
import { describe, expect, it, vi } from "vitest";
import { TableService } from "../src/service";
import { createTableState } from "../src/state";
import { QUERY_TEXT_LITERAL } from "@zoobzio/query";
import type {
  Actions,
  Change,
  Config,
  FetchResult,
  Options,
  State,
} from "../src/types";
import {
  fakeActions,
  fakeBulkActions,
  fakeColumns,
  fakeRows,
  getRowId,
} from "./data";
import type { FakeRow } from "./data";

const base: Config<FakeRow> = { columns: fakeColumns, getRowId };

const makeActions = (rows: FakeRow[] = fakeRows) => ({
  fetch: vi.fn(async (): Promise<FetchResult<FakeRow>> => ({
    data: rows,
    rowCount: 40,
  })),
});

const makeService = (
  overrides: {
    state?: State<FakeRow>;
    actions?: Actions<FakeRow>;
    config?: Partial<Config<FakeRow>>;
    options?: Options<FakeRow>;
  } = {},
) => {
  const config = { ...base, ...overrides.config };
  const state = overrides.state ?? createTableState<FakeRow>(config);
  const actions = overrides.actions ?? makeActions();
  const service = new TableService<FakeRow>(
    "test-table",
    config,
    state,
    actions,
    overrides.options,
  );
  const updated = vi.fn();
  const filtered = vi.fn();
  service.on("updated", updated);
  service.on("filtered", filtered);
  return { service, table: service.table, state, actions, updated, filtered };
};

const ids = (service: TableService<FakeRow>): string[] =>
  service.table.getVisibleLeafColumns().map((c) => c.id);

describe("fetch", () => {
  it("passes the pagination and sorting slices and applies the result", async () => {
    const { service, table, state, actions } = makeService();
    state.pagination = { pageIndex: 1, pageSize: 10 };
    state.sorting = [{ id: "name", desc: true }];

    await service.fetch();

    expect(actions.fetch).toHaveBeenCalledWith(
      {
        pagination: { pageIndex: 1, pageSize: 10 },
        sorting: [{ id: "name", desc: true }],
        query: "",
        filters: [],
      },
      service,
    );
    expect(service.data).toEqual(fakeRows);
    expect(service.rowCount).toBe(40);
    expect(table.getRowModel().rows.map((r) => r.id)).toEqual(["1", "2", "3"]);
    expect(table.getPageCount()).toBe(4);
  });

  it("holds loading during flight and clears it after", async () => {
    const box: { resolve?: (r: FetchResult<FakeRow>) => void } = {};
    const actions = {
      fetch: vi.fn(
        () =>
          new Promise<FetchResult<FakeRow>>((res) => {
            box.resolve = res;
          }),
      ),
    };
    const { service } = makeService({ actions });

    const flight = service.fetch();
    expect(service.loading).toBe(true);
    box.resolve?.({ data: [], rowCount: 0 });
    await flight;
    expect(service.loading).toBe(false);
  });

  it("clears loading and still emits when the action throws", async () => {
    const actions = {
      fetch: vi.fn(async () => Promise.reject(new Error("boom"))),
    };
    const { service, updated } = makeService({ actions });

    await expect(service.fetch()).rejects.toThrow("boom");
    expect(service.loading).toBe(false);
    expect(updated).toHaveBeenCalledWith({ id: "test-table", rowCount: 0 });
  });

  it("emits updated with the fresh row count", async () => {
    const { service, updated } = makeService();
    await service.fetch();
    expect(updated).toHaveBeenCalledWith({ id: "test-table", rowCount: 40 });
  });
});

describe("the container", () => {
  it("is where every write through the table lands", async () => {
    const { service, table, state } = makeService({
      config: { bulkActions: fakeBulkActions },
    });
    await service.fetch();

    table.setPageIndex(2);
    table.getColumn("name")?.toggleSorting(true);
    table.getRow("2").toggleSelected(true);
    table.setColumnOrder(["amount", "id"]);
    table.getColumn("status")?.toggleVisibility(false);
    table.setColumnSizing({ name: 240 });

    expect(state.pagination).toEqual({ pageIndex: 2, pageSize: 10 });
    expect(state.sorting).toEqual([{ id: "name", desc: true }]);
    expect(state.rowSelection).toEqual({ "2": true });
    expect(state.columnOrder).toEqual(["amount", "id"]);
    expect(state.columnVisibility).toEqual({ status: false });
    expect(state.columnSizing).toEqual({ name: 240 });
  });

  it("is what the table reads, whoever wrote it", async () => {
    const { service, table, state } = makeService();
    await service.fetch();

    state.columnVisibility = { name: false };
    state.columnOrder = ["amount"];
    state.pagination = { pageIndex: 3, pageSize: 10 };
    state.data = [fakeRows[2]!];

    expect(ids(service)).toEqual(["amount", "id", "status", "created"]);
    expect(table.getCanNextPage()).toBe(false);
    expect(table.getRowModel().rows.map((r) => r.original)).toEqual([
      fakeRows[2],
    ]);
  });

  it("is shared: two services over one container never disagree", async () => {
    const a = makeService();
    const b = makeService({ state: a.state });
    await a.service.fetch();

    a.table.getColumn("name")?.toggleVisibility(false);
    a.table.setPageIndex(1);

    expect(ids(b.service)).not.toContain("name");
    expect(b.table.getRowModel().rows).toHaveLength(fakeRows.length);
    expect(b.state.pagination.pageIndex).toBe(1);
  });

  it("starts the table from the config's initial state, and resets to it", () => {
    const { table, state } = makeService({
      config: { initialState: { columnOrder: ["amount", "name"] } },
    });
    expect(state.columnOrder).toEqual(["amount", "name"]);
    table.setColumnOrder(["id"]);
    table.resetColumnOrder();
    expect(state.columnOrder).toEqual(["amount", "name"]);
  });
});

describe("refetching", () => {
  it("a change of page refetches, and one that changes nothing does not", () => {
    const { table, state, actions } = makeService();
    state.rowCount = 40;
    table.setPageIndex(1);
    expect(actions.fetch).toHaveBeenCalledOnce();
    table.setPageIndex(1);
    expect(actions.fetch).toHaveBeenCalledOnce();
    table.nextPage();
    expect(actions.fetch).toHaveBeenCalledTimes(2);
  });

  it("a change of page size refetches and keeps the top row in view", () => {
    const { table, state, actions } = makeService();
    state.pagination = { pageIndex: 3, pageSize: 10 };
    table.setPageSize(20);
    expect(state.pagination).toEqual({ pageIndex: 1, pageSize: 20 });
    expect(actions.fetch).toHaveBeenCalledOnce();
  });

  it("a sort refetches and stays on the page", () => {
    const { table, state, actions } = makeService();
    state.pagination = { pageIndex: 2, pageSize: 10 };
    table.getColumn("name")?.toggleSorting();
    expect(state.sorting).toHaveLength(1);
    expect(state.pagination.pageIndex).toBe(2);
    expect(actions.fetch).toHaveBeenCalledOnce();
  });

  it("the first sort of a column follows the type of its values", async () => {
    const { service, table, state } = makeService();
    await service.fetch();
    table.getColumn("name")?.toggleSorting();
    expect(state.sorting).toEqual([{ id: "name", desc: false }]);
    table.getColumn("amount")?.toggleSorting();
    expect(state.sorting).toEqual([{ id: "amount", desc: true }]);
  });

  it("a third sort of a column clears it, and a multi sort adds to the list", async () => {
    const { service, table, state } = makeService();
    await service.fetch();
    const name = table.getColumn("name");
    name?.toggleSorting();
    name?.toggleSorting();
    expect(state.sorting).toEqual([{ id: "name", desc: true }]);
    name?.toggleSorting();
    expect(state.sorting).toEqual([]);
    name?.toggleSorting();
    table.getColumn("amount")?.toggleSorting(undefined, true);
    expect(state.sorting).toEqual([
      { id: "name", desc: false },
      { id: "amount", desc: true },
    ]);
  });

  it("the server sorts and pages: the table renders the rows as fetched", async () => {
    const { service, table } = makeService();
    await service.fetch();
    table.getColumn("amount")?.toggleSorting(true);
    expect(table.getRowModel().rows.map((r) => r.original)).toEqual(fakeRows);
  });

  it("a write of selection, order, visibility, or size does not refetch", async () => {
    const { service, table, actions } = makeService({
      config: { bulkActions: fakeBulkActions },
    });
    await service.fetch();
    table.toggleAllPageRowsSelected(true);
    table.setColumnOrder(["amount"]);
    table.getColumn("name")?.toggleVisibility(false);
    table.setColumnSizing({ name: 200 });
    expect(actions.fetch).toHaveBeenCalledOnce();
  });
});

describe("columns", () => {
  it("a column that refuses hiding stays", () => {
    const { service, table } = makeService();
    table.getColumn("id")?.toggleVisibility(false);
    table.getColumn("name")?.toggleVisibility(false);
    expect(ids(service)).toEqual(["id", "status", "created", "amount"]);
  });

  it("a column's size is the one it declares, the default, or the one it is given, held at its minimum", () => {
    const { table } = makeService();
    expect(table.getColumn("id")?.getSize()).toBe(80);
    expect(table.getColumn("name")?.getSize()).toBe(150);
    table.setColumnSizing({ name: 40, amount: 300 });
    expect(table.getColumn("name")?.getSize()).toBe(120);
    expect(table.getColumn("amount")?.getSize()).toBe(300);
    expect(table.getTotalSize()).toBe(80 + 120 + 150 + 150 + 300);
  });
});

describe("selection", () => {
  it("is on with bulk actions, off without, and as the config says", async () => {
    const bare = makeService();
    await bare.service.fetch();
    expect(bare.table.getRow("1").getCanSelect()).toBe(false);

    const bulk = makeService({ config: { bulkActions: fakeBulkActions } });
    await bulk.service.fetch();
    expect(bulk.table.getRow("1").getCanSelect()).toBe(true);

    const forced = makeService({ config: { enableRowSelection: true } });
    await forced.service.fetch();
    expect(forced.table.getRow("1").getCanSelect()).toBe(true);
  });

  it("outlives the page it was made on", async () => {
    const { service, table, state } = makeService({
      config: { bulkActions: fakeBulkActions },
    });
    await service.fetch();
    table.toggleAllPageRowsSelected(true);
    state.data = [{ ...fakeRows[0]!, id: 9 }];
    expect(table.getIsAllPageRowsSelected()).toBe(false);
    expect(table.getSelectedRowIds()).toEqual(["1", "2", "3"]);
  });
});

describe("actions", () => {
  it("exposes each action under its config key", () => {
    const { service } = makeService({
      config: { actions: fakeActions, bulkActions: fakeBulkActions },
    });
    expect(service.actions.map((a) => a.key)).toEqual(["edit", "delete"]);
    expect(service.bulkActions.map((a) => a.key)).toEqual(["deleteSelected"]);
  });

  it("runAction dispatches a row to the handler under the key", () => {
    const edit = vi.fn();
    const { service } = makeService({
      config: { actions: fakeActions },
      actions: { ...makeActions(), actions: { edit } },
    });
    const row = fakeRows[0]!;
    service.runAction("edit", row);
    service.runAction("ghost", row);
    expect(edit).toHaveBeenCalledExactlyOnceWith(row);
  });

  it("runBulkAction dispatches the ids of the selected rows", async () => {
    const deleteSelected = vi.fn();
    const { service, table } = makeService({
      config: { bulkActions: fakeBulkActions },
      actions: { ...makeActions(), bulkActions: { deleteSelected } },
    });
    await service.fetch();
    table.getRow("1").toggleSelected(true);
    table.getRow("2").toggleSelected(true);
    service.runBulkAction("deleteSelected");
    expect(deleteSelected).toHaveBeenCalledExactlyOnceWith(["1", "2"]);
  });

  it("the live action closures call the handlers under their keys", () => {
    const edit = vi.fn();
    const deleteSelected = vi.fn();
    const { service } = makeService({
      config: { actions: fakeActions, bulkActions: fakeBulkActions },
      actions: {
        ...makeActions(),
        actions: { edit },
        bulkActions: { deleteSelected },
      },
    });
    service.actions[0]!.action(fakeRows[0]!);
    service.bulkActions[0]!.action(["9"]);
    expect(edit).toHaveBeenCalledWith(fakeRows[0]);
    expect(deleteSelected).toHaveBeenCalledWith(["9"]);
  });
});

describe("query", () => {
  it("keys one field per filterable column, in column order, labeled by its meta", () => {
    const { service } = makeService();
    expect(Object.keys(service.query.fields)).toEqual([
      "id",
      "name",
      "status",
      "created",
      "amount",
    ]);
    expect(service.query.fields.name).toEqual({ label: "Name" });
  });

  it("gives a field the operators, default operator, and values its column declares", () => {
    const { service } = makeService();
    expect(service.query.fields.amount).toEqual({
      label: "Amount",
      operators: ["over", "under", "is"],
      defaultOperator: "is",
    });
    expect(service.query.fields.created).toEqual({
      label: "Created",
      operators: ["before", "after", "on"],
      defaultOperator: "on",
      values: expect.any(Function),
    });
    expect(service.query.fields.status).toEqual({
      label: "Status",
      values: ["Active", "Inactive", "Pending"],
    });
  });

  it("labels a column without one by its id, and drops an empty operator list with its default", () => {
    const { service } = makeService({
      config: {
        columns: [
          { accessorKey: "name" },
          {
            accessorKey: "amount",
            meta: { label: "Amount", operators: [], defaultOperator: "is" },
          },
        ],
      },
    });
    expect(service.query.fields).toEqual({
      name: { label: "name" },
      amount: { label: "Amount" },
    });
  });

  it("lets a date column's own values win over the days", () => {
    const { service } = makeService({
      config: {
        columns: [
          {
            accessorKey: "created",
            meta: { label: "Created", type: "date", values: ["today"] },
          },
        ],
      },
    });
    expect(service.query.fields.created).toEqual({
      label: "Created",
      values: ["today"],
    });
  });

  it("carries a meta's properties beyond the ones the table reads onto the field, and keeps the link off it", () => {
    const link = (row: FakeRow) => `/rows/${row.id}`;
    const meta = { label: "Name", align: "right" as const, link, icon: "user" };
    const { service, table } = makeService({
      config: { columns: [{ accessorKey: "name", meta }] },
    });
    expect(table.getColumn("name")?.columnDef.meta?.link).toBe(link);
    expect(service.query.fields.name).toEqual({ label: "Name", icon: "user" });
  });

  it("leaves out a column that reads no value, an action or an image one, unless its meta says", () => {
    const { service } = makeService({
      config: {
        columns: [
          { accessorKey: "name", meta: { label: "Name" } },
          { id: "open", meta: { label: "Open" } },
          { accessorKey: "id", meta: { label: "Run", type: "action" } },
          {
            accessorKey: "status",
            meta: { label: "Avatar", type: "image", filterable: true },
          },
          {
            accessorKey: "amount",
            meta: { label: "Amount", filterable: false },
          },
        ],
      },
    });
    expect(Object.keys(service.query.fields)).toEqual(["name", "status"]);
  });

  it("suggests days for a date column, today first in the config's zone", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-11-04T23:30:00Z"));
      const { service } = makeService({ config: { timeZone: "Asia/Tokyo" } });
      service.query.setDraft("Created: on ");
      expect(service.query.stage).toBe("value");
      expect(service.query.items[0]).toEqual({
        stage: "value",
        value: "2026-11-05",
        label: "2026-11-05",
      });
      service.query.setDraft("Created: on 2025-03-1");
      expect(service.query.hint).toBe("9");
      expect(service.query.items.map((i) => i.value)).toContain("2025-03-15");
      service.query.select(service.query.items.at(-1)!);
      expect(service.query.filters).toEqual([
        { key: "created", op: "on", value: "2025-03-10" },
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("leads with the text literal, Search, or the literals the config names", () => {
    const { service } = makeService();
    expect(service.query.items[0]).toEqual({
      stage: "literal",
      value: "text",
      label: "Search",
    });
    const named = makeService({
      config: { literals: { text: { ...QUERY_TEXT_LITERAL, label: "Find" } } },
    });
    expect(named.service.query.items[0]?.label).toBe("Find");
    service.query.setDraft('"acme"');
    expect(service.query.text).toBe("acme");
  });

  it("holds its entries and draft in the table's container", () => {
    const { service, state } = makeService();
    service.query.add({ kind: "literal", key: "text", value: "acme" });
    service.query.setDraft("Sta");
    expect(state.entries).toEqual([
      { kind: "literal", key: "text", value: "acme" },
    ]);
    expect(state.draft).toBe("Sta");
  });

  it("a change to the entries goes to the first page, refetches once, and emits filtered", () => {
    const { service, state, actions, filtered } = makeService();
    state.pagination = { pageIndex: 3, pageSize: 10 };
    service.query.add({ kind: "literal", key: "text", value: "acme" });
    expect(state.pagination).toEqual({ pageIndex: 0, pageSize: 10 });
    expect(actions.fetch).toHaveBeenCalledOnce();
    expect(filtered).toHaveBeenCalledWith({
      id: "test-table",
      query: "acme",
      filters: [],
    });
    state.pagination = { pageIndex: 1, pageSize: 10 };
    service.query.add({ kind: "filter", key: "status", value: "Active" });
    expect(state.pagination.pageIndex).toBe(0);
    expect(actions.fetch).toHaveBeenCalledTimes(2);
    expect(filtered).toHaveBeenLastCalledWith({
      id: "test-table",
      query: "acme",
      filters: [{ key: "status", value: "Active" }],
    });
    service.query.remove(0);
    expect(actions.fetch).toHaveBeenCalledTimes(3);
  });

  it("a rejected or repeated entry does not refetch", () => {
    const { service, actions } = makeService();
    service.query.add({
      kind: "filter",
      key: "created",
      op: "over",
      value: "x",
    });
    service.query.remove(0);
    expect(actions.fetch).not.toHaveBeenCalled();
    service.query.add({ kind: "literal", key: "text", value: "acme" });
    service.query.add({ kind: "literal", key: "text", value: "acme" });
    expect(actions.fetch).toHaveBeenCalledOnce();
  });

  it("a submitted draft commits through the column schema", () => {
    const { service } = makeService();
    service.query.setDraft("Amount: over 40");
    service.query.submit();
    service.query.setDraft("Created: 2026-02-01");
    service.query.submit();
    expect(service.query.filters).toEqual([
      { key: "amount", op: "over", value: "40" },
      { key: "created", op: "on", value: "2026-02-01" },
    ]);
    expect(service.query.draft).toBe("");
  });

  it("starts from the config's initial entries", async () => {
    const config = {
      ...base,
      initialEntries: [
        { kind: "filter" as const, key: "status", value: "Active" },
      ],
    };
    const { service, actions } = makeService({ config });
    await service.fetch();
    expect(actions.fetch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: [{ key: "status", value: "Active" }],
      }),
      service,
    );
  });

  it("fetch params carry the query's text and filters", async () => {
    const { service, actions } = makeService();
    service.query.add({ kind: "literal", key: "text", value: "acme" });
    service.query.add({ kind: "filter", key: "status", value: "Active" });
    await service.fetch();
    expect(actions.fetch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        query: "acme",
        filters: [{ key: "status", value: "Active" }],
      }),
      service,
    );
  });

  it("a query write reaches the table's change stream", () => {
    const { service } = makeService();
    const change = vi.fn();
    service.on("change", change);
    service.query.setDraft("x");
    expect(change).toHaveBeenCalledWith(
      expect.objectContaining({ field: "draft", before: "", after: "x" }),
    );
  });

  it("searchable defaults on and follows config off", () => {
    expect(makeService().service.searchable).toBe(true);
    expect(
      makeService({ config: { searchable: false } }).service.searchable,
    ).toBe(false);
  });

  it("locale, currency, and time zone default and follow config", () => {
    expect(makeService().service.locale).toBe("en-US");
    expect(makeService().service.currency).toBe("USD");
    expect(makeService().service.timeZone).toBe("UTC");
    const { service } = makeService({
      config: { locale: "de-DE", currency: "EUR", timeZone: "Europe/Berlin" },
    });
    expect(service.locale).toBe("de-DE");
    expect(service.currency).toBe("EUR");
    expect(service.timeZone).toBe("Europe/Berlin");
  });
});

describe("middleware", () => {
  it("get middleware shapes every read of its field, the table's included", () => {
    const { table, state } = makeService({
      options: {
        get: { state: { columnVisibility: (v) => ({ ...v, amount: false }) } },
      },
    });
    expect(table.getColumn("amount")?.getIsVisible()).toBe(false);
    expect(state.columnVisibility).toEqual({});
  });

  it("set middleware shapes the stored value, the table's and the query's slices included", () => {
    const { service, table, state } = makeService({
      options: {
        set: {
          state: {
            draft: (draft) => draft.trim(),
            pagination: (p) => ({ ...p, pageSize: Math.min(p.pageSize, 50) }),
          },
        },
      },
    });
    service.query.setDraft("  acme  ");
    table.setPageSize(100);
    expect(state.draft).toBe("acme");
    expect(service.query.draft).toBe("acme");
    expect(state.pagination.pageSize).toBe(50);
  });

  it("a missing slot passes the value on", () => {
    const { table, state } = makeService({ options: { get: {}, set: {} } });
    table.setPageSize(50);
    expect(state.pagination.pageSize).toBe(50);
  });
});

describe("events", () => {
  it("emits change for every write, a write through the table included", () => {
    const changes: Change<FakeRow>[] = [];
    const { service, table } = makeService();
    service.on("change", (change) => changes.push(change));
    table.setPageSize(20);
    expect(changes).toEqual([
      {
        field: "pagination",
        before: { pageIndex: 0, pageSize: 10 },
        after: { pageIndex: 0, pageSize: 20 },
      },
      { field: "loading", before: false, after: true },
    ]);
  });

  it("change narrows on field", () => {
    const { service, table } = makeService();
    const seen: number[] = [];
    service.on("change", (change) => {
      if (change.field === "pagination") seen.push(change.after.pageSize);
    });
    table.setPageSize(20);
    expect(seen).toEqual([20]);
  });

  it("calls listeners in subscription order and unsubscribes", async () => {
    const { service } = makeService();
    const order: string[] = [];
    const off = service.on("updated", () => order.push("a"));
    service.on("updated", () => order.push("b"));
    await service.fetch();
    off();
    await service.fetch();
    expect(order).toEqual(["a", "b", "b"]);
  });

  it("a listener can unsubscribe itself during the call", async () => {
    const { service } = makeService();
    const calls = vi.fn();
    const off = service.on("updated", () => {
      calls();
      off();
    });
    await service.fetch();
    await service.fetch();
    expect(calls).toHaveBeenCalledOnce();
  });
});

describe("init", () => {
  it("fetches once and is idempotent", async () => {
    const { service, actions } = makeService();
    await service.init();
    await service.init();
    expect(actions.fetch).toHaveBeenCalledOnce();
    expect(service.initialized).toBe(true);
  });
});
