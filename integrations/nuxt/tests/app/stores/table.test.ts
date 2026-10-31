// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container, config-driven
// defaults, and the one-time seed, not the proxy plumbing.
import type { Config } from "@zoobzio/table";
import type { FakeRow } from "#test/data/table";

import { describe, expect, it } from "vitest";
import { accessTable } from "../../../app/stores/table";
import { fakeColumns } from "#test/data/table";

const config: Config<FakeRow> = { columns: fakeColumns, rowKey: "id" };

describe("accessTable", () => {
  it("initializes the container from the config defaults", () => {
    const state = accessTable("t1", config);
    expect(state.initialized).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.data).toEqual([]);
    expect(state.page).toBe(1);
    expect(state.pageSize).toBe(25);
    expect(state.sortField).toBeNull();
    expect(state.selected).toEqual(new Set());
    expect(state.columnOrder).toEqual(["id", "name", "status", "amount"]);
    expect(state.entries).toEqual([]);
  });

  it("seeds the container from the initial slice", () => {
    const state = accessTable("t1", config, {
      page: 3,
      pageSize: 50,
      sortField: "name",
      sortDirection: "desc",
      columnOrder: ["name", "id"],
      entries: [{ kind: "literal", key: "text", value: "ali" }],
    });
    expect(state.page).toBe(3);
    expect(state.pageSize).toBe(50);
    expect(state.sortField).toBe("name");
    expect(state.sortDirection).toBe("desc");
    expect(state.columnOrder).toEqual(["name", "id"]);
    expect(state.entries).toEqual([
      { kind: "literal", key: "text", value: "ali" },
    ]);
    expect(state.data).toEqual([]);
    expect(state.initialized).toBe(false);
  });

  it("same id shares state across calls and seeds only once", () => {
    const first = accessTable("t1", config, { pageSize: 50 });
    first.page = 2;
    const second = accessTable("t1", config, { pageSize: 10 });
    expect(second).toBe(first);
    expect(second.page).toBe(2);
    expect(second.pageSize).toBe(50);
  });

  it("different ids get independent state", () => {
    const a = accessTable("t1", config);
    const b = accessTable("t2", config);
    a.page = 4;
    expect(b.page).toBe(1);
  });
});
