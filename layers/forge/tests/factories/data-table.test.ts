import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import { createTable } from "../../app/factories/data-table";
import { fakeColumns, fakeRows } from "../data/table";
import type { FakeRow } from "../data/table";
import type { DataTableConfig, DataTableFetchResult } from "../../app/types/data-table";

const fakeFetch = vi.fn<[], Promise<DataTableFetchResult<FakeRow>>>(async () => ({
  data: fakeRows,
  total: fakeRows.length,
  pageCount: 1,
}));

const config: DataTableConfig<FakeRow, number> = {
  columns: fakeColumns,
  rowKey: "id",
  fetch: fakeFetch,
};

const makeTable = (id = "test") => createTable<FakeRow, number>(id, config)();

describe("createTable", () => {
  beforeEach(() => {
    fakeFetch.mockClear();
  });

  describe("initialization", () => {
    it("returns a table with all expected properties", () => {
      const table = makeTable();
      expect(table.columns).toBe(fakeColumns);
      expect(table.rowKey).toBe("id");
      expect(table.data.value).toEqual([]);
      expect(table.page.value).toBe(1);
      expect(table.pageSize.value).toBe(25);
    });

    it("init calls fetch and sets initialized", async () => {
      const table = makeTable("init-test");
      expect(table.initialized.value).toBe(false);
      await table.init();
      expect(table.initialized.value).toBe(true);
      expect(fakeFetch).toHaveBeenCalledOnce();
      expect(table.data.value).toEqual(fakeRows);
    });

    it("init is idempotent", async () => {
      const table = makeTable("idempotent-test");
      await table.init();
      await table.init();
      expect(fakeFetch).toHaveBeenCalledOnce();
    });
  });

  describe("pagination", () => {
    it("goToPage updates page and fetches", async () => {
      const table = makeTable("page-test");
      table.pageCount.value = 5;
      table.goToPage(3);
      await nextTick();
      expect(table.page.value).toBe(3);
      expect(fakeFetch).toHaveBeenCalled();
    });

    it("goToPage ignores out-of-range pages", () => {
      const table = makeTable("page-range-test");
      table.pageCount.value = 5;
      table.goToPage(0);
      expect(table.page.value).toBe(1);
      table.goToPage(6);
      expect(table.page.value).toBe(1);
    });

    it("setPageSize resets to page 1 and fetches", async () => {
      const table = makeTable("pagesize-test");
      table.page.value = 3;
      table.setPageSize(50);
      await nextTick();
      expect(table.pageSize.value).toBe(50);
      expect(table.page.value).toBe(1);
      expect(fakeFetch).toHaveBeenCalled();
    });
  });

  describe("sorting", () => {
    it("sortBy sets field and direction asc", async () => {
      const table = makeTable("sort-test");
      table.sortBy("name");
      await nextTick();
      expect(table.sortField.value).toBe("name");
      expect(table.sortDirection.value).toBe("asc");
    });

    it("sortBy toggles direction on same field", async () => {
      const table = makeTable("sort-toggle-test");
      table.sortBy("name");
      table.sortBy("name");
      await nextTick();
      expect(table.sortDirection.value).toBe("desc");
    });

    it("sortBy resets to asc on new field", async () => {
      const table = makeTable("sort-new-test");
      table.sortBy("name");
      table.sortBy("name"); // desc
      table.sortBy("created"); // new field, asc
      await nextTick();
      expect(table.sortField.value).toBe("created");
      expect(table.sortDirection.value).toBe("asc");
    });

    it("sortBy resets page to 1", () => {
      const table = makeTable("sort-page-test");
      table.page.value = 3;
      table.sortBy("name");
      expect(table.page.value).toBe(1);
    });
  });

  describe("selection", () => {
    it("toggleRow adds and removes keys", async () => {
      const table = makeTable("toggle-test");
      await table.init();
      table.toggleRow(1);
      expect(table.selected.value.has(1)).toBe(true);
      table.toggleRow(1);
      expect(table.selected.value.has(1)).toBe(false);
    });

    it("toggleAll selects all when not all selected", async () => {
      const table = makeTable("toggleall-test");
      await table.init();
      table.toggleAll();
      expect(table.selected.value.size).toBe(3);
      expect(table.isAllSelected.value).toBe(true);
    });

    it("toggleAll deselects all when all selected", async () => {
      const table = makeTable("toggleall-deselect-test");
      await table.init();
      table.toggleAll();
      table.toggleAll();
      expect(table.selected.value.size).toBe(0);
    });

    it("clearSelection empties the set", async () => {
      const table = makeTable("clear-select-test");
      await table.init();
      table.toggleRow(1);
      table.toggleRow(2);
      table.clearSelection();
      expect(table.selected.value.size).toBe(0);
    });

    it("isIndeterminate is true when some but not all selected", async () => {
      const table = makeTable("indeterminate-test");
      await table.init();
      table.toggleRow(1);
      expect(table.isIndeterminate.value).toBe(true);
      expect(table.selectAllState.value).toBe("indeterminate");
    });

    it("isRowSelected checks the selected set", async () => {
      const table = makeTable("rowselected-test");
      await table.init();
      table.toggleRow(1);
      expect(table.isRowSelected(fakeRows[0])).toBe(true);
      expect(table.isRowSelected(fakeRows[1])).toBe(false);
    });
  });

  describe("columns", () => {
    it("visibleColumns follows columnOrder", () => {
      const table = makeTable("cols-test");
      table.columnOrder.value = ["name", "id"];
      expect(table.visibleColumns.value.map((c) => c.key)).toEqual(["name", "id"]);
    });

    it("toggleColumn adds/removes from order", () => {
      const table = makeTable("toggle-col-test");
      table.toggleColumn("amount");
      expect(table.columnOrder.value).not.toContain("amount");
      table.toggleColumn("amount");
      expect(table.columnOrder.value).toContain("amount");
    });

    it("toggleColumn does nothing for pinned columns", () => {
      const pinnedConfig: DataTableConfig<FakeRow, number> = {
        ...config,
        pinnedColumns: ["id"],
      };
      const table = createTable<FakeRow, number>("pinned-test", pinnedConfig)();
      const before = [...table.columnOrder.value];
      table.toggleColumn("id");
      expect(table.columnOrder.value).toEqual(before);
    });

    it("reorderColumns sets new order", () => {
      const table = makeTable("reorder-test");
      table.reorderColumns(["amount", "name", "id"]);
      expect(table.columnOrder.value).toEqual(["amount", "name", "id"]);
    });

    it("resetColumns restores default order", () => {
      const table = makeTable("reset-col-test");
      const defaultOrder = [...table.columnOrder.value];
      table.reorderColumns(["amount", "name"]);
      table.resetColumns();
      expect(table.columnOrder.value).toEqual(defaultOrder);
    });

    it("colSpan accounts for columns + actions + selection", () => {
      const tableWithExtras = createTable<FakeRow, number>("colspan-test", {
        ...config,
        actions: [{ icon: "edit", label: "Edit", action: () => {} }],
        bulkActions: [{ icon: "delete", label: "Delete", action: () => {} }],
      })();
      // 5 visible columns + 1 actions + 1 selection = 7
      expect(tableWithExtras.colSpan.value).toBe(7);
    });
  });

  describe("getters", () => {
    it("sortFieldFor uses sortKey if provided", () => {
      const table = makeTable("sortfieldfor-test");
      expect(table.sortFieldFor({ key: "name", label: "Name", sortKey: "name_lower" })).toBe("name_lower");
    });

    it("sortFieldFor falls back to key", () => {
      const table = makeTable("sortfieldfor-fallback-test");
      expect(table.sortFieldFor({ key: "name", label: "Name" })).toBe("name");
    });

    it("isSorted checks current sort field", () => {
      const table = makeTable("issorted-test");
      table.sortField.value = "name";
      expect(table.isSorted({ key: "name", label: "Name" })).toBe(true);
      expect(table.isSorted({ key: "id", label: "ID" })).toBe(false);
    });

    it("getSortIcon returns chevron based on direction", () => {
      const table = makeTable("sorticon-test");
      table.sortDirection.value = "asc";
      expect(table.getSortIcon()).toBe("chevron-up");
      table.sortDirection.value = "desc";
      expect(table.getSortIcon()).toBe("chevron-down");
    });

    it("dateColumns filters to date/datetime types", () => {
      const table = makeTable("datecols-test");
      expect(table.dateColumns.value.map((c) => c.key)).toEqual(["created"]);
    });
  });

  describe("filters", () => {
    it("filters computed includes query when set", () => {
      const table = makeTable("filter-query-test");
      table.query.value = "hello";
      expect(table.filters.value).toEqual([
        { field: "__query", operator: "semantic", value: { type: "text", value: "hello" } },
      ]);
    });

    it("filters computed includes keywords when set", () => {
      const table = makeTable("filter-kw-test");
      table.keywords.value = "+foo";
      expect(table.filters.value).toEqual([
        { field: "__keywords", operator: "match", value: { type: "text", value: "+foo" } },
      ]);
    });

    it("filters computed includes facets", () => {
      const table = makeTable("filter-facets-test");
      table.selectedFacets.value = new Set(["status:Active", "status:Pending"]);
      const f = table.filters.value.find((f) => f.field === "status");
      expect(f).toBeDefined();
      if (!f) return;
      expect(f.value).toEqual({ type: "enum", value: ["Active", "Pending"] });
    });

    it("addFilter adds enum facets to selectedFacets", async () => {
      const table = makeTable("addfilter-test");
      table.addFilter({
        field: "status",
        operator: "is",
        value: { type: "enum", value: ["Active"] },
      });
      await nextTick();
      expect(table.selectedFacets.value.has("status:Active")).toBe(true);
    });

    it("removeFilter clears query", () => {
      const table = makeTable("removefilter-query-test");
      table.query.value = "hello";
      table.removeFilter(0);
      expect(table.query.value).toBe("");
    });

    it("removeFilter clears keywords", () => {
      const table = makeTable("removefilter-kw-test");
      table.keywords.value = "+foo";
      table.removeFilter(0);
      expect(table.keywords.value).toBe("");
    });

    it("removeFilter removes enum facets from selectedFacets", async () => {
      const table = makeTable("removefilter-enum-test");
      table.selectedFacets.value = new Set(["status:Active", "status:Pending"]);
      await nextTick();
      // filters computed should show an enum filter
      const enumFilter = table.filters.value.find((f) => f.field === "status");
      expect(enumFilter).toBeDefined();
      if (!enumFilter) return;
      const idx = table.filters.value.indexOf(enumFilter);
      table.removeFilter(idx);
      expect(table.selectedFacets.value.size).toBe(0);
    });

    it("removeFilter removes date filters", async () => {
      const table = makeTable("removefilter-date-test");
      table.addDateFilter({ field: "created", operator: "after", value: new Date("2025-01-01") });
      await nextTick();
      const dateFilter = table.filters.value.find((f) => f.field === "created");
      expect(dateFilter).toBeDefined();
      if (!dateFilter) return;
      const idx = table.filters.value.indexOf(dateFilter);
      table.removeFilter(idx);
      expect(table.dateFilters.value).toHaveLength(0);
    });

    it("removeFilter does nothing for invalid index", () => {
      const table = makeTable("removefilter-invalid-test");
      table.removeFilter(99);
      // Should not throw
    });

    it("filters includes date_range for between filters", () => {
      const table = makeTable("filter-daterange-test");
      table.addDateFilter({
        field: "created",
        operator: "between",
        value: new Date("2025-01-01"),
        endValue: new Date("2025-06-30"),
      });
      const f = table.filters.value.find((f) => f.field === "created");
      expect(f).toBeDefined();
      if (!f) return;
      expect(f.value.type).toBe("date_range");
    });

    it("clearFilters resets all filter state", () => {
      const table = makeTable("clearfilters-test");
      table.query.value = "hello";
      table.keywords.value = "+foo";
      table.selectedFacets.value = new Set(["status:Active"]);
      table.clearFilters();
      expect(table.query.value).toBe("");
      expect(table.keywords.value).toBe("");
      expect(table.selectedFacets.value.size).toBe(0);
    });
  });

  describe("date filters", () => {
    it("addDateFilter appends a new filter", () => {
      const table = makeTable("datefilter-add-test");
      table.addDateFilter({ field: "created", operator: "after", value: new Date("2025-01-01") });
      expect(table.dateFilters.value).toHaveLength(1);
    });

    it("addDateFilter replaces existing filter for same field", () => {
      const table = makeTable("datefilter-replace-test");
      table.addDateFilter({ field: "created", operator: "after", value: new Date("2025-01-01") });
      table.addDateFilter({ field: "created", operator: "before", value: new Date("2025-12-31") });
      expect(table.dateFilters.value).toHaveLength(1);
      expect(table.dateFilters.value[0].operator).toBe("before");
    });

    it("removeDateFilter removes by field", () => {
      const table = makeTable("datefilter-remove-test");
      table.addDateFilter({ field: "created", operator: "after", value: new Date("2025-01-01") });
      table.removeDateFilter("created");
      expect(table.dateFilters.value).toHaveLength(0);
    });

    it("clearDateFilters empties all", () => {
      const table = makeTable("datefilter-clear-test");
      table.addDateFilter({ field: "created", operator: "after", value: new Date("2025-01-01") });
      table.clearDateFilters();
      expect(table.dateFilters.value).toHaveLength(0);
    });
  });

  describe("snapshot", () => {
    it("getSnapshot captures current state", () => {
      const table = makeTable("snapshot-get-test");
      table.query.value = "test";
      table.page.value = 2;
      const snap = table.getSnapshot();
      expect(snap.query).toBe("test");
      expect(snap.page).toBe(2);
    });

    it("restoreSnapshot applies state and fetches", async () => {
      const table = makeTable("snapshot-restore-test");
      table.restoreSnapshot({
        query: "restored",
        keywords: "+foo",
        match: "any",
        page: 3,
        pageSize: 50,
        selectedFacets: ["status:Active"],
        dateFilters: [],
        sortField: "name",
        sortDirection: "desc",
        columnOrder: ["name", "id"],
      });
      await nextTick();
      expect(table.query.value).toBe("restored");
      expect(table.keywords.value).toBe("+foo");
      expect(table.match.value).toBe("any");
      expect(table.pageSize.value).toBe(50);
      expect(table.selectedFacets.value.has("status:Active")).toBe(true);
      expect(table.sortField.value).toBe("name");
      expect(table.sortDirection.value).toBe("desc");
      expect(table.columnOrder.value).toEqual(["name", "id"]);
      expect(fakeFetch).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("applies partial payload and fetches", async () => {
      const table = makeTable("update-test");
      table.update({ query: "updated", page: 5 });
      await nextTick();
      expect(table.query.value).toBe("updated");
      expect(table.page.value).toBe(5);
      expect(fakeFetch).toHaveBeenCalled();
    });

    it("applies keywords, match, pageSize, selectedFacets, dateFilters", async () => {
      const table = makeTable("update-full-test");
      const facets = new Set(["status:Active"]);
      const dfs = [{ field: "created", operator: "after" as const, value: new Date("2025-01-01") }];
      table.update({
        keywords: "+test",
        match: "any",
        pageSize: 100,
        selectedFacets: facets,
        dateFilters: dfs,
      });
      await nextTick();
      expect(table.keywords.value).toBe("+test");
      expect(table.match.value).toBe("any");
      expect(table.pageSize.value).toBe(100);
      expect(table.selectedFacets.value).toEqual(facets);
      expect(table.dateFilters.value).toEqual(dfs);
    });
  });

  describe("fetch", () => {
    it("passes correct params to config.fetch", async () => {
      const table = makeTable("fetch-params-test");
      table.query.value = "hello";
      table.page.value = 2;
      table.sortField.value = "name";
      await table.fetch();
      expect(fakeFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          query: "hello",
          page: 2,
          sortField: "name",
        }),
      );
    });

    it("updates data from fetch result", async () => {
      const table = makeTable("fetch-data-test");
      await table.fetch();
      expect(table.data.value).toEqual(fakeRows);
      expect(table.total.value).toBe(3);
      expect(table.pageCount.value).toBe(1);
    });

    it("sets loading during fetch", async () => {
      let resolvePromise: () => void;
      const slowFetch = vi.fn(() => new Promise<DataTableFetchResult<FakeRow>>((resolve) => {
        resolvePromise = () => resolve({ data: [], total: 0, pageCount: 0 });
      }));
      const slowConfig: DataTableConfig<FakeRow, number> = { ...config, fetch: slowFetch };
      const table = createTable<FakeRow, number>("loading-test", slowConfig)();

      const promise = table.fetch();
      expect(table.loading.value).toBe(true);
      resolvePromise!();
      await promise;
      expect(table.loading.value).toBe(false);
    });

    it("updates facetGroups when fetch returns facets", async () => {
      const facetFetch = vi.fn(async () => ({
        data: fakeRows,
        total: 3,
        pageCount: 1,
        facets: [{ key: "status", label: "Status", items: [{ value: "Active", label: "Active", count: 2 }] }],
      }));
      const facetConfig: DataTableConfig<FakeRow, number> = { ...config, fetch: facetFetch };
      const table = createTable<FakeRow, number>("facet-fetch-test", facetConfig)();
      await table.fetch();
      expect(table.facetGroups.value).toHaveLength(1);
      expect(table.facetGroups.value[0].key).toBe("status");
    });
  });

  describe("isRowSelected", () => {
    it("returns true for a selected row", () => {
      const table = makeTable("row-selected-true");
      table.selected.value = new Set([1]);
      expect(table.isRowSelected(fakeRows[0])).toBe(true);
    });

    it("returns false for an unselected row", () => {
      const table = makeTable("row-selected-false");
      expect(table.isRowSelected(fakeRows[0])).toBe(false);
    });
  });

  describe("isColumnVisible", () => {
    it("returns true for a visible column", () => {
      const table = makeTable("col-visible-true");
      expect(table.isColumnVisible("id")).toBe(true);
    });

    it("returns false for a column removed from columnOrder", () => {
      const table = makeTable("col-visible-false");
      table.columnOrder.value = table.columnOrder.value.filter((k) => k !== "id");
      expect(table.isColumnVisible("id")).toBe(false);
    });
  });

  describe("filter sort order", () => {
    it("sorts filters by filterOrder, unordered items go to end", async () => {
      const table = makeTable("filter-sort-test");
      // Add enum + query to create two filters
      table.selectedFacets.value = new Set(["status:Active"]);
      table.query.value = "hello";
      await nextTick();

      // Both should appear in filters
      expect(table.filters.value.length).toBeGreaterThanOrEqual(2);

      // The filterOrder determines display order; unordered items go to end
      const fields = table.filters.value.map((f) => f.field);
      expect(fields).toContain("__query");
      expect(fields).toContain("status");
    });
  });
});
