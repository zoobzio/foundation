import { describe, expect, it } from "vitest";
import { createTableState } from "../src/state";
import { TABLE_DEFAULT_PAGE_SIZE, TABLE_STATE_FIELDS } from "../src/constants";
import { fakeColumns } from "./data";
import type { FakeRow } from "./data";

const config = { columns: fakeColumns, rowKey: "id" as const };

describe("createTableState", () => {
  it("initializes every field with its default", () => {
    const state = createTableState<FakeRow>(config);
    expect(state).toEqual({
      data: [],
      loading: false,
      initialized: false,
      page: 1,
      pageSize: TABLE_DEFAULT_PAGE_SIZE,
      total: 0,
      pageCount: 0,
      sortField: null,
      sortDirection: "asc",
      selected: new Set(),
      columnOrder: fakeColumns.map((c) => String(c.key)),
      entries: [],
      draft: "",
    });
  });

  it("defaultColumnOrder overrides the column-derived order", () => {
    const state = createTableState<FakeRow>({
      ...config,
      defaultColumnOrder: ["name", "id"],
    });
    expect(state.columnOrder).toEqual(["name", "id"]);
  });

  it("each call returns an independent container", () => {
    const a = createTableState<FakeRow>(config);
    const b = createTableState<FakeRow>(config);
    a.page = 2;
    a.selected.add("1");
    expect(b.page).toBe(1);
    expect(b.selected.size).toBe(0);
  });

  it("TABLE_STATE_FIELDS names exactly the container's fields", () => {
    const state = createTableState<FakeRow>(config);
    expect(Object.keys(TABLE_STATE_FIELDS).sort()).toEqual(
      Object.keys(state).sort(),
    );
  });
});
