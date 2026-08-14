// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is keyed shared state, defaults, and config-driven
// initialization, not the ref plumbing.
import { describe, expect, it } from "vitest";
import { accessTable } from "../../../app/stores/table";
import { TABLE_DEFAULT_PAGE_SIZE } from "../../../app/constants/table";
import { fakeColumns } from "#test/data/table";
import type { FakeRow } from "#test/data/table";

const config = { columns: fakeColumns, rowKey: "id" as const };

describe("accessTable", () => {
  it("initializes state with defaults", () => {
    const state = accessTable<FakeRow, number>("t1", config);
    expect(state.data.value).toEqual([]);
    expect(state.loading.value).toBe(false);
    expect(state.initialized.value).toBe(false);
    expect(state.page.value).toBe(1);
    expect(state.pageSize.value).toBe(TABLE_DEFAULT_PAGE_SIZE);
    expect(state.selected.value).toEqual(new Set());
    expect(state.columnOrder.value).toEqual(fakeColumns.map((c) => String(c.key)));
  });

  it("same id shares state across calls", () => {
    const first = accessTable<FakeRow, number>("t1", config);
    first.page.value = 3;
    const second = accessTable<FakeRow, number>("t1", config);
    expect(second.page).toBe(first.page);
    expect(second.page.value).toBe(3);
  });

  it("different ids get independent state", () => {
    const a = accessTable<FakeRow, number>("t1", config);
    const b = accessTable<FakeRow, number>("t2", config);
    a.page.value = 5;
    expect(b.page.value).toBe(1);
  });

  it("defaultColumnOrder overrides the column-derived order", () => {
    const state = accessTable<FakeRow, number>("t3", {
      ...config,
      defaultColumnOrder: ["name", "id"],
    });
    expect(state.columnOrder.value).toEqual(["name", "id"]);
  });
});
