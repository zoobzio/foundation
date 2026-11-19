// Constructor-injected seams — a plain state container, a vi.fn() Actions
// fake, and vi.fn() listeners. The table is TanStack's, so nothing here
// tests what it computes: every test drives the service's own part — the
// container as the owner of the table's state, the fetch a write causes,
// the query, the actions, the events.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TableService } from "../src/service";
import { createTableState } from "../src/state";
import { TABLE_DEFAULT_PERMISSIONS } from "../src/constants";
import { QUERY_TEXT_LITERAL } from "@zoobzio/query";
import type {
  Actions,
  Change,
  Config,
  FetchResult,
  Options,
  Permission,
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

/** The columns as the head lays them out: the pinned ones lead and trail. */
const heads = (service: TableService<FakeRow>): string[] =>
  service.table.getLeafHeaders().map((header) => header.column.id);

describe("fetch", () => {
  it("drops a fetch that settles after a later one began", async () => {
    const pages: ((result: FetchResult<FakeRow>) => void)[] = [];
    const fetch = vi.fn(
      () => new Promise<FetchResult<FakeRow>>((resolve) => pages.push(resolve)),
    );
    const { service, state, updated } = makeService({ actions: { fetch } });
    const first = service.fetch();
    const second = service.fetch();

    pages[1]?.({ data: fakeRows.slice(0, 1), rowCount: 1 });
    await second;
    pages[0]?.({ data: fakeRows, rowCount: 40 });
    await first;

    expect(state.data).toEqual(fakeRows.slice(0, 1));
    expect(state.rowCount).toBe(1);
    expect(state.loading).toBe(false);
    expect(updated).toHaveBeenCalledTimes(1);
  });

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

  it("a write of selection, order, pinning, visibility, or size does not refetch", async () => {
    const { service, table, actions } = makeService({
      config: { bulkActions: fakeBulkActions },
    });
    await service.fetch();
    table.toggleAllPageRowsSelected(true);
    table.setColumnOrder(["amount"]);
    table.getColumn("amount")?.pin("end");
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

describe("pinning", () => {
  it("a pinned column leads or trails the rest, and the container holds where", () => {
    const { service, table, state } = makeService();
    table.getColumn("amount")?.pin("start");
    table.getColumn("id")?.pin("end");
    expect(state.columnPinning).toEqual({ start: ["amount"], end: ["id"] });
    expect(heads(service)).toEqual([
      "amount",
      "name",
      "status",
      "created",
      "id",
    ]);
    expect(table.getColumn("amount")?.getIsPinned()).toBe("start");

    table.getColumn("amount")?.pin(false);
    expect(state.columnPinning).toEqual({ start: [], end: ["id"] });
    expect(heads(service)).toEqual([
      "name",
      "status",
      "created",
      "amount",
      "id",
    ]);
  });

  it("starts from the config's initial state, and a column may refuse", () => {
    const { service, table } = makeService({
      config: {
        columns: fakeColumns.map((column, i) =>
          i === 1 ? { ...column, enablePinning: false } : column,
        ),
        initialState: { columnPinning: { start: ["status"], end: [] } },
      },
    });
    expect(heads(service).at(0)).toBe("status");
    expect(table.getColumn("name")?.getCanPin()).toBe(false);
    expect(table.getColumn("status")?.getCanPin()).toBe(true);
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

    const some = makeService({
      config: {
        bulkActions: fakeBulkActions,
        enableRowSelection: (row) => row.id !== "1",
      },
    });
    await some.service.fetch();
    expect(some.table.getRow("1").getCanSelect()).toBe(false);
    expect(some.table.getRow("2").getCanSelect()).toBe(true);
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

  it("holds its clauses and draft in the table's container", () => {
    const { service, state } = makeService();
    service.query.add({ kind: "literal", key: "text", value: "acme" });
    service.query.setDraft("Sta");
    expect(state.clauses).toEqual([
      { kind: "literal", key: "text", value: "acme" },
    ]);
    expect(state.draft).toBe("Sta");
  });

  it("a change to the clauses goes to the first page, refetches once, and emits filtered", () => {
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

  it("a rejected or repeated clause does not refetch", () => {
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

  it("starts from the config's initial clauses", async () => {
    const config = {
      ...base,
      initialClauses: [
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

describe("views", () => {
  const arranged = {
    sorting: [{ id: "name", desc: true }],
    columnOrder: ["name", "id"],
    columnPinning: { start: ["amount"], end: [] },
    columnVisibility: { status: false },
    columnSizing: { name: 240 },
    pageSize: 25,
    clauses: [{ kind: "filter" as const, key: "status", value: "Active" }],
    interval: 0,
  };

  it("snapshots the arrangement, without the page or the selection", () => {
    const { service, table } = makeService({
      config: { bulkActions: fakeBulkActions },
    });
    table.setSorting([{ id: "name", desc: false }]);
    table.setPageIndex(2);
    table.setRowSelection({ "1": true });
    expect(service.snapshot()).toEqual({
      sorting: [{ id: "name", desc: false }],
      columnOrder: [],
      columnPinning: { start: [], end: [] },
      columnVisibility: {},
      columnSizing: {},
      pageSize: 10,
      clauses: [],
      interval: 0,
    });
  });

  it("restores an arrangement from the first page in one fetch", async () => {
    const { service, table, actions, filtered } = makeService();
    await service.init();
    table.setPageIndex(3);
    await Promise.resolve();
    vi.mocked(actions.fetch).mockClear();
    const restored = vi.fn();
    service.on("restored", restored);

    service.restore(arranged);

    expect(actions.fetch).toHaveBeenCalledOnce();
    expect(actions.fetch).toHaveBeenCalledWith(
      {
        pagination: { pageIndex: 0, pageSize: 25 },
        sorting: arranged.sorting,
        query: "",
        filters: [{ key: "status", value: "Active" }],
      },
      service,
    );
    // The table reads the container, so it sees what was restored.
    const visible = table.getVisibleLeafColumns().map((column) => column.id);
    expect(visible.slice(0, 2)).toEqual(["name", "id"]);
    expect(heads(service).at(0)).toBe("amount");
    expect(visible).not.toContain("status");
    expect(table.getColumn("name")?.getSize()).toBe(240);
    expect(filtered).toHaveBeenCalledOnce();
    expect(restored).toHaveBeenCalledWith({
      id: "test-table",
      snapshot: arranged,
    });
  });

  it("gives back what it was restored with", () => {
    const { service } = makeService();
    service.restore(arranged);
    expect(service.snapshot()).toEqual(arranged);
  });

  it("fetches nothing before init, and the first fetch reads it", async () => {
    const { service, actions } = makeService();
    service.restore(arranged);
    expect(actions.fetch).not.toHaveBeenCalled();
    await service.init();
    expect(actions.fetch).toHaveBeenCalledOnce();
    expect(actions.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        pagination: { pageIndex: 0, pageSize: 25 },
        sorting: arranged.sorting,
      }),
      service,
    );
  });

  it("fetches again once the restore is done with the query", async () => {
    const { service, actions } = makeService();
    await service.init();
    service.restore(arranged);
    vi.mocked(actions.fetch).mockClear();
    service.query.clear();
    expect(actions.fetch).toHaveBeenCalledOnce();
  });
});

describe("permissions", () => {
  const full = { actions: fakeActions, bulkActions: fakeBulkActions };

  it("grants every permission by default and takes away what the config says", () => {
    const { service } = makeService();
    for (const key of Object.keys(TABLE_DEFAULT_PERMISSIONS)) {
      expect(service.can(key as Permission)).toBe(true);
    }
    const denied = makeService({ config: { permissions: { sort: false } } });
    expect(denied.service.can("sort")).toBe(false);
    expect(denied.service.can("hide")).toBe(true);
  });

  it("reads the record on every check, so a change of it is followed", () => {
    const permissions = { sort: true };
    const { service, table } = makeService({ config: { permissions } });
    expect(table.getColumn("name")?.getCanSort()).toBe(true);
    permissions.sort = false;
    expect(service.can("sort")).toBe(false);
    expect(table.getColumn("name")?.getCanSort()).toBe(false);
  });

  it("answers the table's own checks: sort, multi-sort, hide, resize, pin", () => {
    const { table } = makeService({
      config: {
        permissions: {
          sort: false,
          multiSort: false,
          hide: false,
          resize: false,
          pin: false,
        },
      },
    });
    const name = table.getColumn("name");
    expect(name?.getCanSort()).toBe(false);
    expect(name?.getCanMultiSort()).toBe(false);
    expect(name?.getCanHide()).toBe(false);
    expect(name?.getCanResize()).toBe(false);
    expect(name?.getCanPin()).toBe(false);

    const open = makeService().table;
    expect(open.getColumn("name")?.getCanSort()).toBe(true);
    expect(open.getColumn("name")?.getCanMultiSort()).toBe(true);
    expect(open.getColumn("name")?.getCanHide()).toBe(true);
    expect(open.getColumn("name")?.getCanResize()).toBe(true);
    expect(open.getColumn("name")?.getCanPin()).toBe(true);
    // A column's own switch still stands under a granted permission.
    expect(open.getColumn("status")?.getCanSort()).toBe(false);
    expect(open.getColumn("id")?.getCanHide()).toBe(false);
  });

  it("selects only with select, bulkActions, and bulk actions to run", async () => {
    const off = makeService({
      config: { ...full, permissions: { select: false } },
    });
    await off.service.fetch();
    expect(off.table.getRow("1").getCanSelect()).toBe(false);
    expect(off.service.bulkActions).toHaveLength(1);

    const none = makeService({
      config: { ...full, permissions: { bulkActions: false } },
    });
    await none.service.fetch();
    expect(none.table.getRow("1").getCanSelect()).toBe(false);
  });

  it("has no actions, and runs none, without their permission", () => {
    const edit = vi.fn();
    const deleteSelected = vi.fn();
    const permissions = { actions: false, bulkActions: false };
    const { service } = makeService({
      config: { ...full, permissions },
      actions: {
        ...makeActions(),
        actions: { edit },
        bulkActions: { deleteSelected },
      },
    });
    expect(service.actions).toEqual([]);
    expect(service.bulkActions).toEqual([]);
    service.runAction("edit", fakeRows[0] as FakeRow);
    service.runBulkAction("deleteSelected");
    expect(edit).not.toHaveBeenCalled();
    expect(deleteSelected).not.toHaveBeenCalled();

    permissions.actions = true;
    permissions.bulkActions = true;
    expect(service.actions.map((a) => a.key)).toEqual(["edit", "delete"]);
    service.runAction("edit", fakeRows[0] as FakeRow);
    service.runBulkAction("deleteSelected");
    expect(edit).toHaveBeenCalledWith(fakeRows[0]);
    expect(deleteSelected).toHaveBeenCalledWith([]);
  });

  it("drops a write of the column order without reorder", () => {
    const { table, state } = makeService({
      config: { permissions: { reorder: false } },
    });
    table.setColumnOrder(["amount", "id"]);
    expect(state.columnOrder).toEqual([]);
  });

  it("drops a change of page size without pageSize, and still pages", async () => {
    const { service, table, state, actions } = makeService({
      config: { permissions: { pageSize: false } },
    });
    await service.fetch();
    table.setPageSize(50);
    expect(state.pagination).toEqual({ pageIndex: 0, pageSize: 10 });
    table.setPageIndex(2);
    expect(state.pagination).toEqual({ pageIndex: 2, pageSize: 10 });
    expect(actions.fetch).toHaveBeenCalledTimes(2);
  });

  it("restores a snapshot whatever the permissions say", () => {
    const { service, state } = makeService({
      config: {
        permissions: {
          sort: false,
          reorder: false,
          pin: false,
          pageSize: false,
        },
      },
    });
    service.restore({
      sorting: [{ id: "name", desc: true }],
      columnOrder: ["amount", "id"],
      columnPinning: { start: [], end: ["name"] },
      columnVisibility: {},
      columnSizing: {},
      pageSize: 50,
      clauses: [],
      interval: 0,
    });
    expect(state.sorting).toEqual([{ id: "name", desc: true }]);
    expect(state.columnOrder).toEqual(["amount", "id"]);
    expect(state.columnPinning).toEqual({ start: [], end: ["name"] });
    expect(state.pagination.pageSize).toBe(50);
  });
});

const synced = (
  refresh: NonNullable<Actions<FakeRow>["refresh"]>,
  config: Partial<Config<FakeRow>> = {},
) => {
  const actions = { ...makeActions(), refresh: vi.fn(refresh) };
  return { ...makeService({ actions, config }), actions };
};

describe("sync", () => {
  const AT = "2026-01-01T00:00:00.000Z";
  const fresh: FakeRow[] = fakeRows.slice(0, 1);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(AT));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("has no sync without a refresh", () => {
    expect(makeService().service.sync).toBeUndefined();
  });

  it("has a sync over the container with one, on the config's interval", () => {
    const { service, state } = synced(() => false, {
      sync: { intervals: [5_000], interval: 5_000 },
    });
    expect(service.sync?.id).toBe("test-table-sync");
    expect(service.sync?.intervals).toEqual([5_000]);
    expect(service.sync?.interval).toBe(5_000);
    service.sync?.setInterval(0);
    expect(state.interval).toBe(0);
  });

  it("marks a fetch with the time its request was made", async () => {
    const { service, state, actions } = synced(() => false);
    actions.fetch.mockImplementationOnce(async () => {
      vi.setSystemTime(new Date("2026-01-01T00:00:09.000Z"));
      return { data: fakeRows, rowCount: 40 };
    });
    await service.init();
    expect(state.since).toBe(AT);
  });

  it("marks a fetch with the since its result names", async () => {
    const { service, state, actions } = synced(() => false);
    actions.fetch.mockResolvedValueOnce({
      data: fakeRows,
      rowCount: 40,
      since: "v1",
    });
    await service.init();
    expect(state.since).toBe("v1");
  });

  it("hands the refresh the fetch's params and the mark", async () => {
    const { service, actions } = synced(() => false);
    await service.init();
    await service.sync?.poll();
    expect(actions.refresh).toHaveBeenCalledExactlyOnceWith(
      {
        pagination: { pageIndex: 0, pageSize: 10 },
        sorting: [],
        query: "",
        filters: [],
        since: AT,
      },
      service,
    );
  });

  it("keeps the page, and the mark, where nothing changed", async () => {
    for (const answer of [false, null, undefined]) {
      const { service, state, actions, updated } = synced(() => answer);
      await service.init();
      updated.mockClear();
      vi.setSystemTime(new Date("2026-01-01T00:01:00.000Z"));
      await service.sync?.poll();
      expect(state.data).toBe(fakeRows);
      expect(state.since).toBe(AT);
      expect(actions.fetch).toHaveBeenCalledOnce();
      expect(updated).not.toHaveBeenCalled();
      vi.setSystemTime(new Date(AT));
    }
  });

  it("lands the page a refresh answers with, quietly", async () => {
    const { service, state, actions, updated } = synced(async () => ({
      data: fresh,
      rowCount: 1,
    }));
    await service.init();
    updated.mockClear();
    const loading: boolean[] = [];
    service.on("change", (change) => {
      if (change.field === "loading") loading.push(change.after);
    });
    vi.setSystemTime(new Date("2026-01-01T00:01:00.000Z"));
    await service.sync?.poll();
    expect(state.data).toBe(fresh);
    expect(state.rowCount).toBe(1);
    expect(state.since).toBe("2026-01-01T00:01:00.000Z");
    expect(actions.fetch).toHaveBeenCalledOnce();
    expect(loading).toEqual([]);
    expect(updated).toHaveBeenCalledExactlyOnceWith({
      id: "test-table",
      rowCount: 1,
    });
  });

  it("fetches the page itself where the refresh answers true", async () => {
    const { service, state, actions } = synced(() => true);
    await service.init();
    actions.fetch.mockResolvedValueOnce({ data: fresh, rowCount: 1 });
    await service.sync?.poll();
    expect(actions.fetch).toHaveBeenCalledTimes(2);
    expect(state.data).toBe(fresh);
  });

  it("polls nothing before the first fetch", async () => {
    const { service, state, actions } = synced(() => true);
    state.since = AT;
    await service.sync?.poll();
    expect(actions.refresh).not.toHaveBeenCalled();
  });

  it("drops a page that comes back to a table that has moved on", async () => {
    let settle: (page: FetchResult<FakeRow>) => void = () => {};
    const { service, state } = synced(
      () => new Promise<FetchResult<FakeRow>>((resolve) => (settle = resolve)),
    );
    await service.init();
    const out = service.sync?.poll();
    vi.setSystemTime(new Date("2026-01-01T00:00:05.000Z"));
    await service.fetch();
    settle({ data: fresh, rowCount: 1 });
    await out;
    expect(state.data).toBe(fakeRows);
    expect(state.since).toBe("2026-01-01T00:00:05.000Z");
  });

  it("drops a page that comes back while a fetch is out", async () => {
    let settle: (page: FetchResult<FakeRow>) => void = () => {};
    const { service, state, actions } = synced(
      () => new Promise<FetchResult<FakeRow>>((resolve) => (settle = resolve)),
    );
    await service.init();
    const out = service.sync?.poll();
    actions.fetch.mockReturnValueOnce(new Promise(() => {}));
    void service.fetch();
    settle({ data: fresh, rowCount: 1 });
    await out;
    expect(state.data).toBe(fakeRows);
  });

  it("emits failed on the sync for a refresh that rejects", async () => {
    const error = new Error("down");
    const { service, state } = synced(async () => {
      throw error;
    });
    const failed = vi.fn();
    service.sync?.on("failed", failed);
    await service.init();
    await service.sync?.poll();
    expect(failed).toHaveBeenCalledExactlyOnceWith({
      id: "test-table-sync",
      error,
    });
    expect(state.data).toBe(fakeRows);
  });

  it("keeps the page alive on the interval while watched", async () => {
    const { service, actions } = synced(() => false, {
      sync: { interval: 10_000 },
    });
    await service.init();
    const stop = service.sync?.watch();
    await vi.advanceTimersByTimeAsync(9_000);
    await service.fetch();
    await vi.advanceTimersByTimeAsync(9_999);
    expect(actions.refresh).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(actions.refresh).toHaveBeenCalledOnce();
    stop?.();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(actions.refresh).toHaveBeenCalledOnce();
  });
});

describe("sync in a view", () => {
  const live = (interval: number) => ({
    sorting: [],
    columnOrder: [],
    columnPinning: { start: [], end: [] },
    columnVisibility: {},
    columnSizing: {},
    pageSize: 10,
    clauses: [],

    interval,
  });

  it("snapshots the interval the sync is on", () => {
    const { service } = synced(() => false);
    service.sync?.setInterval(30_000);
    expect(service.snapshot().interval).toBe(30_000);
  });

  it("restores the interval through the sync, so the wait starts over on it", async () => {
    vi.useFakeTimers();
    try {
      const { service, actions } = synced(() => false);
      await service.init();
      const changed = vi.fn();
      service.sync?.on("changed", changed);
      const stop = service.sync?.watch();
      service.restore(live(10_000));
      expect(service.snapshot().interval).toBe(10_000);
      expect(changed).toHaveBeenCalledExactlyOnceWith({
        id: "test-table-sync",
        interval: 10_000,
      });
      await vi.advanceTimersByTimeAsync(10_000);
      expect(actions.refresh).toHaveBeenCalledOnce();
      service.restore(live(0));
      await vi.advanceTimersByTimeAsync(60_000);
      expect(actions.refresh).toHaveBeenCalledOnce();
      stop?.();
    } finally {
      vi.useRealTimers();
    }
  });

  it("leaves out an interval the sync does not offer", () => {
    const { service } = synced(() => false);
    service.sync?.setInterval(30_000);
    service.restore(live(1));
    expect(service.snapshot().interval).toBe(30_000);
  });

  it("keeps the interval it holds where there is no sync to set it", () => {
    const { service } = makeService();
    service.restore(live(30_000));
    expect(service.snapshot().interval).toBe(0);
  });
});
