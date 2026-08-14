// Gold standard: factories. The factory composes store + service through the
// shim's Nuxt seams — tests assert the composition: live reactive views over
// shared keyed state, not re-tested service logic (that depth lives in
// tests/services/table.test.ts).
import { describe, expect, it, vi } from "vitest";
import { createTable } from "#foundation/factories/table";
import type { DataTableFetchResult } from "#foundation/types/data/table";
import { fakeColumns, fakeRows } from "#test/data/table";
import type { FakeRow } from "#test/data/table";

const makeActions = () => ({
  fetch: vi.fn(
    async (): Promise<DataTableFetchResult<FakeRow>> => ({
      data: fakeRows,
      total: fakeRows.length,
      pageCount: 4,
    }),
  ),
});

const config = { columns: fakeColumns, rowKey: "id" as const };

describe("createTable", () => {
  it("yields the widget triple carrying the settings input", () => {
    const widget = createTable<FakeRow, number>("f1", {
      config,
      actions: makeActions(),
      settings: { root: { label: "contacts" } },
    })();
    expect(widget.component).toBeDefined();
    expect(widget.settings).toEqual({ root: { label: "contacts" } });
  });

  it("builds a table over fresh store state", () => {
    const table = createTable<FakeRow, number>("f1", { config, actions: makeActions() })().service;
    expect(table.id).toBe("f1");
    expect(table.data).toEqual([]);
    expect(table.initialized).toBe(false);
    expect(table.visibleColumns.map((c) => c.key)).toEqual(
      fakeColumns.map((c) => c.key),
    );
  });

  it("init drives the fetch pipeline into the reactive views", async () => {
    const actions = makeActions();
    const table = createTable<FakeRow, number>("f1", { config, actions })().service;
    await table.init();
    expect(table.data).toEqual(fakeRows);
    expect(table.total).toBe(fakeRows.length);
    expect(table.pageCount).toBe(4);
    expect(table.initialized).toBe(true);
  });

  it("returned refs track service mutations", async () => {
    const table = createTable<FakeRow, number>("f1", { config, actions: makeActions() })().service;
    await table.init();
    table.goToPage(2);
    expect(table.page).toBe(2);
    table.sortBy("name");
    expect(table.sortField).toBe("name");
    expect(table.page).toBe(1);
    table.toggleRow(1);
    expect(table.selectAllState).toBe("indeterminate");
  });

  it("same id shares state across factory instances", async () => {
    const useTable = createTable<FakeRow, number>("f1", { config, actions: makeActions() });
    const a = useTable().service;
    const b = useTable().service;
    await a.init();
    a.goToPage(3);
    expect(b.page).toBe(3);
    expect(b.data).toEqual(fakeRows);
  });

  it("different ids stay independent", async () => {
    const a = createTable<FakeRow, number>("f1", { config, actions: makeActions() })().service;
    const b = createTable<FakeRow, number>("f2", { config, actions: makeActions() })().service;
    await a.init();
    expect(b.initialized).toBe(false);
    expect(b.data).toEqual([]);
  });

  it("keyOf resolves the configured rowKey", () => {
    const table = createTable<FakeRow, number>("f1", { config, actions: makeActions() })().service;
    const row = fakeRows.at(0);
    if (!row) throw new Error("fakeRows is empty");
    expect(table.keyOf(row)).toBe(row.id);
  });
});
