// Gold standard: widget composables. The composable composes store + service
// through the shim's Nuxt seams — tests assert the composition: live reactive
// views over shared keyed state, not re-tested service logic (that depth
// lives in tests/services/table.test.ts).
import { describe, expect, it, vi } from "vitest";
import { toValue } from "vue";
import { useTable } from "../../../app/factories/table";
import type { DataTableFetchResult } from "../../../app/types/data/table";
import { fakeColumns, fakeRows } from "#test/data/table";
import type { FakeRow } from "#test/data/table";

const makeWiring = () => ({
  fetch: vi.fn(
    async (): Promise<DataTableFetchResult<FakeRow>> => ({
      data: fakeRows,
      total: fakeRows.length,
      pageCount: 4,
    }),
  ),
});

const definition = { columns: fakeColumns, rowKey: "id" as const };

describe("useTable", () => {
  it("yields the widget triple resolving pt into settings", () => {
    const widget = useTable(
      "f1",
      { ...definition, pt: { root: { label: "contacts" } } },
      makeWiring(),
    );
    expect(widget.component).toBeDefined();
    expect(toValue(widget.settings)).toEqual({ root: { label: "contacts" } });
  });

  it("merges wiring pt over the definition base per key", () => {
    const widget = useTable(
      "f1",
      {
        ...definition,
        pt: { root: { label: "base" }, toolbar: { label: "kept" } },
      },
      { ...makeWiring(), pt: { root: { label: "override" } } },
    );
    expect(toValue(widget.settings)).toEqual({
      root: { label: "override" },
      toolbar: { label: "kept" },
    });
  });

  it("joins action handlers to their descriptors by key", () => {
    const edit = vi.fn();
    const purge = vi.fn();
    const table = useTable(
      "f1",
      {
        ...definition,
        actions: { edit: { icon: "edit", label: "Edit" } },
        bulkActions: { purge: { icon: "delete", label: "Purge" } },
      },
      { ...makeWiring(), actions: { edit }, bulkActions: { purge } },
    ).service;

    const row = fakeRows.at(0);
    if (!row) throw new Error("fakeRows is empty");
    table.actions.at(0)?.action(row);
    expect(edit).toHaveBeenCalledWith(row);

    table.bulkActions.at(0)?.action(new Set(["1"]));
    expect(purge).toHaveBeenCalledWith(new Set(["1"]));
  });

  it("builds a table over fresh store state", () => {
    const table = useTable("f1", definition, makeWiring()).service;
    expect(table.id).toBe("f1");
    expect(table.data).toEqual([]);
    expect(table.initialized).toBe(false);
    expect(table.visibleColumns.map((c) => c.key)).toEqual(
      fakeColumns.map((c) => c.key),
    );
  });

  it("init drives the fetch pipeline into the reactive views", async () => {
    const wiring = makeWiring();
    const table = useTable("f1", definition, wiring).service;
    await table.init();
    expect(table.data).toEqual(fakeRows);
    expect(table.total).toBe(fakeRows.length);
    expect(table.pageCount).toBe(4);
    expect(table.initialized).toBe(true);
  });

  it("returned refs track service mutations", async () => {
    const table = useTable("f1", definition, makeWiring()).service;
    await table.init();
    table.goToPage(2);
    expect(table.page).toBe(2);
    table.sortBy("name");
    expect(table.sortField).toBe("name");
    expect(table.page).toBe(1);
    table.toggleRow("1");
    expect(table.selectAllState).toBe("indeterminate");
  });

  it("same id shares state across instances", async () => {
    const a = useTable("f1", definition, makeWiring()).service;
    const b = useTable("f1", definition, makeWiring()).service;
    await a.init();
    a.goToPage(3);
    expect(b.page).toBe(3);
    expect(b.data).toEqual(fakeRows);
  });

  it("different ids stay independent", async () => {
    const a = useTable("f1", definition, makeWiring()).service;
    const b = useTable("f2", definition, makeWiring()).service;
    await a.init();
    expect(b.initialized).toBe(false);
    expect(b.data).toEqual([]);
  });

  it("keyOf resolves the configured rowKey", () => {
    const table = useTable("f1", definition, makeWiring()).service;
    const row = fakeRows.at(0);
    if (!row) throw new Error("fakeRows is empty");
    expect(table.keyOf(row)).toBe(String(row.id));
  });
});
