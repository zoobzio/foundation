// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container, config-driven
// defaults, and the one-time seed, not the proxy plumbing.
import type { Config } from "@zoobzio/table";
import type { FakeRow } from "#test/data/table";

import { describe, expect, it } from "vitest";
import { accessTable } from "../../../app/stores/table";
import { fakeColumns, getRowId } from "#test/data/table";

const config: Config<FakeRow> = { columns: fakeColumns, getRowId };

describe("accessTable", () => {
  it("initializes the container from the config defaults", () => {
    const state = accessTable("t1", config);
    expect(state.initialized).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.data).toEqual([]);
    expect(state.pagination).toEqual({ pageIndex: 0, pageSize: 10 });
    expect(state.sorting).toEqual([]);
    expect(state.rowSelection).toEqual({});
    expect(state.columnOrder).toEqual([]);
    expect(state.clauses).toEqual([]);
  });

  it("seeds the container from the config's initial state and clauses", () => {
    const state = accessTable("t1", {
      ...config,
      initialState: {
        pagination: { pageIndex: 2, pageSize: 50 },
        sorting: [{ id: "name", desc: true }],
        columnOrder: ["name", "id"],
      },
      initialClauses: [{ kind: "literal", key: "text", value: "ali" }],
    });
    expect(state.pagination).toEqual({ pageIndex: 2, pageSize: 50 });
    expect(state.sorting).toEqual([{ id: "name", desc: true }]);
    expect(state.columnOrder).toEqual(["name", "id"]);
    expect(state.clauses).toEqual([
      { kind: "literal", key: "text", value: "ali" },
    ]);
    expect(state.data).toEqual([]);
    expect(state.initialized).toBe(false);
  });

  it("same id shares state across calls and seeds only once", () => {
    const sized = (pageSize: number): Config<FakeRow> => ({
      ...config,
      initialState: { pagination: { pageIndex: 0, pageSize } },
    });
    const first = accessTable("t1", sized(50));
    first.pagination = { pageIndex: 1, pageSize: 50 };
    const second = accessTable("t1", sized(10));
    expect(second).toBe(first);
    expect(second.pagination).toEqual({ pageIndex: 1, pageSize: 50 });
  });

  it("different ids get independent state", () => {
    const a = accessTable("t1", config);
    const b = accessTable("t2", config);
    a.pagination = { pageIndex: 3, pageSize: 10 };
    expect(b.pagination.pageIndex).toBe(0);
  });
});
