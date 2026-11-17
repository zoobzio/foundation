import { describe, expect, it } from "vitest";
import { createTableState } from "../src/state";
import { TABLE_STATE_FIELDS } from "../src/constants";
import { fakeColumns, getRowId } from "./data";
import type { FakeRow } from "./data";
import type { Config } from "../src/types";

const config: Config<FakeRow> = { columns: fakeColumns, getRowId };

describe("createTableState", () => {
  it("initializes every field with its default", () => {
    expect(createTableState<FakeRow>(config)).toEqual({
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [],
      rowSelection: {},
      columnOrder: [],
      columnPinning: { start: [], end: [] },
      columnVisibility: {},
      columnSizing: {},
      data: [],
      rowCount: 0,
      loading: false,
      initialized: false,
      clauses: [],
      draft: "",
      suggest: { options: [], status: "idle", more: false },
    });
  });

  it("starts each slice from the config's initial state", () => {
    const state = createTableState<FakeRow>({
      ...config,
      initialState: {
        pagination: { pageIndex: 2, pageSize: 50 },
        sorting: [{ id: "name", desc: true }],
        columnVisibility: { amount: false },
      },
      initialClauses: [{ kind: "literal", key: "text", value: "acme" }],
    });
    expect(state.pagination).toEqual({ pageIndex: 2, pageSize: 50 });
    expect(state.sorting).toEqual([{ id: "name", desc: true }]);
    expect(state.columnVisibility).toEqual({ amount: false });
    expect(state.rowSelection).toEqual({});
    expect(state.clauses).toEqual([
      { kind: "literal", key: "text", value: "acme" },
    ]);
  });

  it("holds exactly the fields the service proxies", () => {
    expect(Object.keys(createTableState<FakeRow>(config)).sort()).toEqual(
      Object.keys(TABLE_STATE_FIELDS).sort(),
    );
  });

  it("builds a container of its own on every call", () => {
    const a = createTableState<FakeRow>(config);
    const b = createTableState<FakeRow>(config);
    expect(a.pagination).not.toBe(b.pagination);
    expect(a.rowSelection).not.toBe(b.rowSelection);
  });

  it("survives a JSON round trip, as a server payload carries it", () => {
    const state = createTableState<FakeRow>(config);
    expect(JSON.parse(JSON.stringify(state))).toEqual(state);
  });
});
