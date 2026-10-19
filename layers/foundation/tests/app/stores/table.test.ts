// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container, defaults, and
// config-driven initialization, not the proxy plumbing.
import { describe, expect, it } from "vitest";
import { accessTable } from "../../../app/stores/table";
import { TABLE_DEFAULT_PAGE_SIZE } from "../../../app/constants/table";
import { fakeColumns } from "#test/data/table";
import type { FakeRow } from "#test/data/table";

const config = { columns: fakeColumns, rowKey: "id" as const };

describe("accessTable", () => {
  it("initializes state with defaults", () => {
    const state = accessTable<FakeRow>("t1", config);
    expect(state.data).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.initialized).toBe(false);
    expect(state.page).toBe(1);
    expect(state.pageSize).toBe(TABLE_DEFAULT_PAGE_SIZE);
    expect(state.selected).toEqual(new Set());
    expect(state.columnOrder).toEqual(fakeColumns.map((c) => String(c.key)));
    expect(state.query).toBe("");
    expect(state.filters).toEqual([]);
  });

  it("same id shares state across calls", () => {
    const first = accessTable<FakeRow>("t1", config);
    first.page = 3;
    const second = accessTable<FakeRow>("t1", config);
    expect(second).toBe(first);
    expect(second.page).toBe(3);
  });

  it("different ids get independent state", () => {
    const a = accessTable<FakeRow>("t1", config);
    const b = accessTable<FakeRow>("t2", config);
    a.page = 5;
    expect(b.page).toBe(1);
  });

  it("defaultColumnOrder overrides the column-derived order", () => {
    const state = accessTable<FakeRow>("t3", {
      ...config,
      defaultColumnOrder: ["name", "id"],
    });
    expect(state.columnOrder).toEqual(["name", "id"]);
  });
});
