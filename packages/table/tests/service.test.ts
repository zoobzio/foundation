// Constructor-injected seams — a plain state container, a vi.fn() Actions
// fake, and vi.fn() listeners. Every test drives a state transition and
// asserts both the new state and the side-channel contracts (fetch params,
// events).
import { describe, expect, it, vi } from "vitest";
import { TableService } from "../src/service";
import { createTableState } from "../src/state";
import type {
  Actions,
  Change,
  Config,
  DataTableFetchResult,
  Options,
  State,
} from "../src/types";
import { fakeColumns, fakeRows, fakeActions, fakeBulkActions } from "./data";
import type { FakeRow } from "./data";

const makeState = (): State<FakeRow> =>
  createTableState<FakeRow>({ columns: fakeColumns, rowKey: "id" });

const makeActions = (rows: FakeRow[] = fakeRows) => ({
  fetch: vi.fn(async (): Promise<DataTableFetchResult<FakeRow>> => ({
    data: rows,
    total: rows.length,
    pageCount: 4,
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
  const state = overrides.state ?? makeState();
  const actions = overrides.actions ?? makeActions();
  const service = new TableService<FakeRow>(
    "test-table",
    { columns: fakeColumns, rowKey: "id", ...overrides.config },
    state,
    actions,
    overrides.options,
  );
  const updated = vi.fn();
  const filtered = vi.fn();
  service.on("updated", updated);
  service.on("filtered", filtered);
  return { service, state, actions, updated, filtered };
};

describe("fetch", () => {
  it("passes current paging/sort params and applies the result", async () => {
    const { service, state, actions } = makeService();
    state.page = 2;
    state.sortField = "name";
    state.sortDirection = "desc";

    await service.fetch();

    expect(actions.fetch).toHaveBeenCalledWith(
      {
        page: 2,
        pageSize: 25,
        sortField: "name",
        sortDirection: "desc",
        query: "",
        filters: [],
      },
      service,
    );
    expect(service.data).toEqual(fakeRows);
    expect(service.total).toBe(fakeRows.length);
    expect(service.pageCount).toBe(4);
  });

  it("holds loading during flight and clears it after", async () => {
    const box: { resolve?: (r: DataTableFetchResult<FakeRow>) => void } = {};
    const actions = {
      fetch: vi.fn(
        () =>
          new Promise<DataTableFetchResult<FakeRow>>((res) => {
            box.resolve = res;
          }),
      ),
    };
    const { service } = makeService({ actions });

    const flight = service.fetch();
    expect(service.loading).toBe(true);
    box.resolve?.({ data: [], total: 0, pageCount: 0 });
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
    expect(updated).toHaveBeenCalledWith({ id: "test-table", total: 0 });
  });

  it("emits updated with the fresh total", async () => {
    const { service, updated } = makeService();
    await service.fetch();
    expect(updated).toHaveBeenCalledWith({
      id: "test-table",
      total: fakeRows.length,
    });
  });
});

describe("paging", () => {
  it("goToPage fetches the page inside bounds", async () => {
    const { service, state, actions } = makeService();
    state.pageCount = 3;
    service.goToPage(2);
    expect(service.page).toBe(2);
    expect(actions.fetch).toHaveBeenCalledOnce();
  });

  it("goToPage ignores out-of-bounds targets", () => {
    const { service, state, actions } = makeService();
    state.pageCount = 3;
    service.goToPage(0);
    service.goToPage(4);
    expect(service.page).toBe(1);
    expect(actions.fetch).not.toHaveBeenCalled();
  });

  it("setPageSize resets to the first page", () => {
    const { service, state } = makeService();
    state.page = 3;
    state.pageCount = 5;
    service.setPageSize(50);
    expect(service.pageSize).toBe(50);
    expect(service.page).toBe(1);
  });
});

describe("sorting", () => {
  it("first sort on a field starts ascending and resets the page", () => {
    const { service, state } = makeService();
    state.page = 2;
    state.pageCount = 5;
    service.sortBy("name");
    expect(service.sortField).toBe("name");
    expect(service.sortDirection).toBe("asc");
    expect(service.page).toBe(1);
  });

  it("sorting the same field toggles direction", () => {
    const { service } = makeService();
    service.sortBy("name");
    service.sortBy("name");
    expect(service.sortDirection).toBe("desc");
    service.sortBy("name");
    expect(service.sortDirection).toBe("asc");
  });

  it("isSorted respects sortKey over key", () => {
    const { service } = makeService();
    const col = { key: "name" as const, label: "Name", sortKey: "name_ci" };
    service.sortBy("name_ci");
    expect(service.isSorted(col)).toBe(true);
    expect(service.isSorted({ key: "name", label: "Name" })).toBe(false);
  });
});

describe("selection", () => {
  it("toggleRow adds then removes a key", () => {
    const { service } = makeService();
    service.toggleRow("1");
    expect(service.selected).toEqual(new Set(["1"]));
    service.toggleRow("1");
    expect(service.selected).toEqual(new Set());
  });

  it("selectAllState walks none → indeterminate → all", async () => {
    const { service } = makeService();
    await service.fetch();
    expect(service.selectAllState).toBe(false);
    service.toggleRow("1");
    expect(service.selectAllState).toBe("indeterminate");
    service.toggleAll();
    expect(service.selectAllState).toBe(true);
    expect(service.selected).toEqual(
      new Set(fakeRows.map((r) => String(r.id))),
    );
  });

  it("toggleAll clears when everything is selected", async () => {
    const { service } = makeService();
    await service.fetch();
    service.toggleAll();
    service.toggleAll();
    expect(service.selected).toEqual(new Set());
  });

  it("isAllSelected is false with no data", () => {
    const { service } = makeService();
    expect(service.isAllSelected).toBe(false);
  });

  it("hasSelection follows the selected set", () => {
    const { service } = makeService();
    expect(service.hasSelection).toBe(false);
    service.toggleRow("1");
    expect(service.hasSelection).toBe(true);
    service.clearSelection();
    expect(service.hasSelection).toBe(false);
  });
});

describe("columns", () => {
  it("toggleColumn hides and re-shows at the definition slot", () => {
    const { service } = makeService();
    service.toggleColumn("name");
    expect(service.isColumnVisible("name")).toBe(false);
    expect(service.columnOrder).toEqual(["id", "status", "created", "amount"]);
    service.toggleColumn("name");
    expect(service.columnOrder).toEqual([
      "id",
      "name",
      "status",
      "created",
      "amount",
    ]);
  });

  it("toggleColumn places a re-shown column relative to the current order", () => {
    const { service } = makeService();
    service.reorderColumns(["amount", "id", "created"]);
    service.toggleColumn("name");
    expect(service.columnOrder).toEqual(["name", "amount", "id", "created"]);
  });

  it("setVisibleColumns keeps the current order and seats new columns", () => {
    const { service } = makeService();
    service.reorderColumns(["amount", "id"]);
    service.setVisibleColumns(["status", "id", "amount"]);
    expect(service.columnOrder).toEqual(["status", "amount", "id"]);
  });

  it("setVisibleColumns keeps pinned columns and drops unknown keys", () => {
    const { service } = makeService({ config: { pinnedColumns: ["id"] } });
    service.setVisibleColumns(["name", "ghost"]);
    expect(service.columnOrder).toEqual(["id", "name"]);
  });

  it("moveColumn moves a column to another column's slot", () => {
    const { service } = makeService();
    service.moveColumn("id", "status");
    expect(service.columnOrder).toEqual([
      "name",
      "status",
      "id",
      "created",
      "amount",
    ]);
    service.moveColumn("amount", "name");
    expect(service.columnOrder).toEqual([
      "amount",
      "name",
      "status",
      "id",
      "created",
    ]);
  });

  it("moveColumn ignores unknown and equal keys", () => {
    const { service, state } = makeService();
    const before = state.columnOrder;
    service.moveColumn("id", "id");
    service.moveColumn("id", "ghost");
    service.moveColumn("ghost", "id");
    expect(state.columnOrder).toBe(before);
  });

  it("toggleColumn refuses pinned columns", () => {
    const { service } = makeService({ config: { pinnedColumns: ["id"] } });
    service.toggleColumn("id");
    expect(service.isColumnVisible("id")).toBe(true);
  });

  it("visibleColumns follows columnOrder and drops unknown keys", () => {
    const { service } = makeService();
    service.reorderColumns(["name", "id", "ghost"]);
    expect(service.visibleColumns.map((c) => c.key)).toEqual(["name", "id"]);
  });

  it("resetColumns restores the configured order", () => {
    const { service } = makeService({
      config: { defaultColumnOrder: ["status", "id"] },
    });
    service.reorderColumns(["id"]);
    service.resetColumns();
    expect(service.columnOrder).toEqual(["status", "id"]);
  });

  it("colSpan adds a column each for row actions and bulk actions", () => {
    const plain = makeService();
    expect(plain.service.colSpan).toBe(fakeColumns.length);
    const armed = makeService({
      config: { actions: fakeActions, bulkActions: fakeBulkActions },
    });
    expect(armed.service.colSpan).toBe(fakeColumns.length + 2);
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

  it("hasActions and isSelectable follow the config", () => {
    const bare = makeService().service;
    expect(bare.hasActions).toBe(false);
    expect(bare.isSelectable).toBe(false);
    const { service } = makeService({
      config: { actions: fakeActions, bulkActions: fakeBulkActions },
    });
    expect(service.hasActions).toBe(true);
    expect(service.isSelectable).toBe(true);
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

  it("runBulkAction dispatches the current selection", () => {
    const deleteSelected = vi.fn();
    const { service } = makeService({
      config: { bulkActions: fakeBulkActions },
      actions: { ...makeActions(), bulkActions: { deleteSelected } },
    });
    service.toggleRow("1");
    service.toggleRow("2");
    service.runBulkAction("deleteSelected");
    expect(deleteSelected).toHaveBeenCalledExactlyOnceWith(new Set(["1", "2"]));
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
    service.bulkActions[0]!.action(new Set(["9"]));
    expect(edit).toHaveBeenCalledWith(fakeRows[0]);
    expect(deleteSelected).toHaveBeenCalledWith(new Set(["9"]));
  });
});

describe("query", () => {
  it("fields mirror the filterable columns with their declared operators, defaults, and values", () => {
    const { service } = makeService();
    expect(Object.keys(service.query.fields)).toEqual(
      service.filterableColumns.map((c) => String(c.key)),
    );
    expect(service.query.fields.amount).toEqual({
      label: "Amount",
      operators: ["over", "under", "is"],
      defaultOperator: "is",
    });
    expect(service.query.fields.created).toEqual({
      label: "Created",
      operators: ["before", "after", "on"],
      defaultOperator: "on",
    });
    expect(service.query.fields.status).toEqual({
      label: "Status",
      values: ["Active", "Inactive", "Pending"],
    });
    expect(service.query.fields.name).toEqual({ label: "Name" });
  });

  it("holds its entries and draft in the table's container", () => {
    const { service, state } = makeService();
    service.query.add({ kind: "text", value: "acme" });
    service.query.setDraft("Sta");
    expect(state.entries).toEqual([{ kind: "text", value: "acme" }]);
    expect(state.draft).toBe("Sta");
  });

  it("a change to the entries resets the page, refetches, and emits filtered", () => {
    const { service, state, actions, filtered } = makeService();
    state.page = 3;
    service.query.add({ kind: "text", value: "acme" });
    expect(service.page).toBe(1);
    expect(actions.fetch).toHaveBeenCalledOnce();
    expect(filtered).toHaveBeenCalledWith({
      id: "test-table",
      query: "acme",
      filters: [],
    });
    state.page = 2;
    service.query.add({ kind: "filter", key: "status", value: "Active" });
    expect(service.page).toBe(1);
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
    service.query.add({ kind: "text", value: "acme" });
    service.query.add({ kind: "text", value: "acme" });
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

  it("fetch params carry the query's text and filters", async () => {
    const { service, actions } = makeService();
    service.query.add({ kind: "text", value: "acme" });
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

  it("filterableColumns excludes action and image columns by default", () => {
    const { service } = makeService({
      config: {
        columns: [
          ...fakeColumns,
          { key: "id", label: "Open", type: "action" },
          { key: "name", label: "Avatar", type: "image", filterable: true },
        ],
      },
    });
    const labels = service.filterableColumns.map((c) => c.label);
    expect(labels).not.toContain("Open");
    expect(labels).toContain("Avatar");
    expect(labels).toContain("Name");
  });
});

describe("middleware", () => {
  it("get middleware shapes every read of its field", () => {
    const { service, state } = makeService({
      options: { get: { state: { page: (page) => page * 10 } } },
    });
    state.page = 2;
    expect(service.page).toBe(20);
    expect(state.page).toBe(2);
  });

  it("set middleware shapes the stored value, the query's slice included", () => {
    const { service, state } = makeService({
      options: { set: { state: { draft: (draft) => draft.trim() } } },
    });
    service.query.setDraft("  acme  ");
    expect(state.draft).toBe("acme");
    expect(service.query.draft).toBe("acme");
  });

  it("a missing slot passes the value on", () => {
    const { service, state } = makeService({ options: { get: {}, set: {} } });
    service.setPageSize(50);
    expect(state.pageSize).toBe(50);
    expect(service.pageSize).toBe(50);
  });
});

describe("events", () => {
  it("emits change for every write, after the set middleware", () => {
    const changes: Change<FakeRow>[] = [];
    const { service } = makeService({
      options: { set: { state: { pageSize: (size) => Math.min(size, 50) } } },
    });
    service.on("change", (change) => changes.push(change));
    service.setPageSize(100);
    expect(changes).toEqual([
      { field: "pageSize", before: 25, after: 50 },
      { field: "page", before: 1, after: 1 },
      { field: "loading", before: false, after: true },
    ]);
  });

  it("change narrows on field", () => {
    const { service } = makeService();
    const seen: number[] = [];
    service.on("change", (change) => {
      if (change.field === "page") seen.push(change.after);
    });
    service.setPageSize(10);
    expect(seen).toEqual([1]);
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

  it("skips the change object when nothing listens", () => {
    const { service, state } = makeService();
    service.goToPage(1);
    expect(state.page).toBe(1);
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
