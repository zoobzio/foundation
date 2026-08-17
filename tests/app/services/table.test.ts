// Gold standard: services. Constructor-injected seams — hand-rolled State
// refs, a vi.fn() Actions fake, and the shim's NuxtApp. No mounting; every
// test drives a state transition and asserts both the new state and the
// side-channel contracts (fetch params, hook emission).
import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useNuxtApp } from "#imports";
import { TableService } from "../../../app/services/table";
import type {
  Actions,
  Config,
  DataTableFetchResult,
  SortDirection,
  State,
} from "../../../app/types/data/table";
import { fakeColumns, fakeRows, fakeActions, fakeBulkActions } from "#test/data/table";
import type { FakeRow } from "#test/data/table";

const makeState = (): State<FakeRow> => ({
  data: ref<FakeRow[]>([]),
  loading: ref(false),
  initialized: ref(false),
  page: ref(1),
  pageSize: ref(25),
  total: ref(0),
  pageCount: ref(0),
  sortField: ref<string | null>(null),
  sortDirection: ref<SortDirection>("asc"),
  selected: ref<Set<string>>(new Set()),
  columnOrder: ref(fakeColumns.map((c) => String(c.key))),
});

const makeActions = (rows: FakeRow[] = fakeRows) => ({
  fetch: vi.fn(
    async (): Promise<DataTableFetchResult<FakeRow>> => ({
      data: rows,
      total: rows.length,
      pageCount: 4,
    }),
  ),
});

const makeService = (
  overrides: {
    state?: State<FakeRow>;
    actions?: Actions<FakeRow>;
    config?: Partial<Config<FakeRow>>;
  } = {},
) => {
  const state = overrides.state ?? makeState();
  const actions = overrides.actions ?? makeActions();
  const nuxt = useNuxtApp();
  const emitSpy = vi.spyOn(nuxt, "callHook");
  const service = new TableService<FakeRow>(
    nuxt,
    "test-table",
    { columns: fakeColumns, rowKey: "id", ...overrides.config },
    state,
    actions,
  );
  return { service, state, actions, emitSpy };
};

describe("fetch", () => {
  it("passes current paging/sort params and applies the result", async () => {
    const { service, state, actions } = makeService();
    state.page.value = 2;
    state.sortField.value = "name";
    state.sortDirection.value = "desc";

    await service.fetch();

    expect(actions.fetch).toHaveBeenCalledWith(
      { page: 2, pageSize: 25, sortField: "name", sortDirection: "desc" },
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
    const actions = { fetch: vi.fn(async () => Promise.reject(new Error("boom"))) };
    const { service, emitSpy } = makeService({ actions });

    await expect(service.fetch()).rejects.toThrow("boom");
    expect(service.loading).toBe(false);
    expect(emitSpy).toHaveBeenCalledWith("table:updated", {
      id: "test-table",
      total: 0,
    });
  });

  it("emits table:updated with the fresh total", async () => {
    const { service, emitSpy } = makeService();
    await service.fetch();
    expect(emitSpy).toHaveBeenCalledWith("table:updated", {
      id: "test-table",
      total: fakeRows.length,
    });
  });
});

describe("paging", () => {
  it("goToPage fetches the page inside bounds", async () => {
    const { service, state, actions } = makeService();
    state.pageCount.value = 3;
    service.goToPage(2);
    expect(service.page).toBe(2);
    expect(actions.fetch).toHaveBeenCalledOnce();
  });

  it("goToPage ignores out-of-bounds targets", () => {
    const { service, state, actions } = makeService();
    state.pageCount.value = 3;
    service.goToPage(0);
    service.goToPage(4);
    expect(service.page).toBe(1);
    expect(actions.fetch).not.toHaveBeenCalled();
  });

  it("setPageSize resets to the first page", () => {
    const { service, state } = makeService();
    state.page.value = 3;
    state.pageCount.value = 5;
    service.setPageSize(50);
    expect(service.pageSize).toBe(50);
    expect(service.page).toBe(1);
  });
});

describe("sorting", () => {
  it("first sort on a field starts ascending and resets the page", () => {
    const { service, state } = makeService();
    state.page.value = 2;
    state.pageCount.value = 5;
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
    expect(service.selected).toEqual(new Set(fakeRows.map((r) => String(r.id))));
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
});

describe("columns", () => {
  it("toggleColumn hides and re-shows, appending to the end", () => {
    const { service } = makeService();
    service.toggleColumn("name");
    expect(service.isColumnVisible("name")).toBe(false);
    service.toggleColumn("name");
    expect(service.columnOrder.at(-1)).toBe("name");
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

describe("init", () => {
  it("fetches once and is idempotent", async () => {
    const { service, actions } = makeService();
    await service.init();
    await service.init();
    expect(actions.fetch).toHaveBeenCalledOnce();
    expect(service.initialized).toBe(true);
  });
});
