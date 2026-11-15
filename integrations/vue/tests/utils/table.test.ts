import type { FakeRow } from "#test/data/table";
import type { TableColumnDef } from "@zoobzio/table";

import { describe, expect, it } from "vitest";
import {
  columnLabel,
  columnOption,
  columnWidth,
  isSelectable,
  moveColumn,
  selectAllState,
} from "../../src/utils/table";
import { fakeBulkActions } from "#test/data/table";
import { makeTable } from "#test/mount/table";

const tableOf = (columns: TableColumnDef<FakeRow>[]) =>
  makeTable({ columns }).service.table;

const ids = (table: ReturnType<typeof tableOf>) =>
  table.getVisibleLeafColumns().map((c) => c.id);

describe("columnLabel", () => {
  it("is the label of the column's meta, or its id", () => {
    const table = tableOf([
      { accessorKey: "id", meta: { label: "ID" } },
      { accessorKey: "name" },
    ]);
    expect(table.getAllLeafColumns().map(columnLabel)).toEqual(["ID", "name"]);
  });
});

describe("columnOption", () => {
  it("maps a column to an option, disabled when it cannot be hidden", () => {
    const table = tableOf([
      { accessorKey: "id", enableHiding: false, meta: { label: "ID" } },
      { accessorKey: "name", meta: { label: "Name" } },
    ]);
    expect(table.getAllLeafColumns().map(columnOption)).toEqual([
      { value: "id", label: "ID", disabled: true },
      { value: "name", label: "Name", disabled: false },
    ]);
  });

  it("carries a meta's properties beyond the ones the table reads onto the option", () => {
    const meta = {
      label: "Name",
      type: "text" as const,
      link: (row: FakeRow) => `/rows/${row.id}`,
      operators: ["is"],
      icon: "user",
    };
    const table = tableOf([{ accessorKey: "name", size: 200, meta }]);
    expect(columnOption(table.getAllLeafColumns()[0]!)).toEqual({
      value: "name",
      label: "Name",
      disabled: false,
      icon: "user",
    });
  });
});

describe("moveColumn", () => {
  it("moves a column to another column's slot", () => {
    const { table } = makeTable().service;
    moveColumn(table, "id", "status");
    expect(ids(table).slice(0, 3)).toEqual(["name", "status", "id"]);
    moveColumn(table, "amount", "name");
    expect(ids(table).slice(0, 2)).toEqual(["amount", "name"]);
  });

  it("ignores unknown and equal keys", () => {
    const { table } = makeTable().service;
    moveColumn(table, "id", "id");
    moveColumn(table, "id", "ghost");
    moveColumn(table, "ghost", "id");
    expect(table.atoms.columnOrder.get()).toEqual([]);
  });
});

describe("isSelectable", () => {
  it("follows the table's row selection, which bulk actions turn on", () => {
    expect(isSelectable(makeTable().service.table)).toBe(false);
    expect(
      isSelectable(makeTable({ bulkActions: fakeBulkActions }).service.table),
    ).toBe(true);
  });
});

describe("selectAllState", () => {
  it("walks none, some, and all of the page's rows", async () => {
    const { service } = makeTable({ bulkActions: fakeBulkActions });
    const { table } = service;
    expect(selectAllState(table)).toBe(false);
    await service.init();
    expect(selectAllState(table)).toBe(false);
    table.getRow("1").toggleSelected(true);
    expect(selectAllState(table)).toBe("indeterminate");
    table.toggleAllPageRowsSelected(true);
    expect(selectAllState(table)).toBe(true);
  });
});

describe("columnWidth", () => {
  it("is the column's size, and none for the last visible column", () => {
    const table = tableOf([
      { accessorKey: "id", size: 80 },
      { accessorKey: "name" },
      { accessorKey: "amount", size: 90 },
    ]);
    const widths = () => table.getAllLeafColumns().map(columnWidth);
    expect(widths()).toEqual([80, 150, undefined]);
    table.getColumn("amount")?.toggleVisibility(false);
    expect(widths().slice(0, 2)).toEqual([80, undefined]);
  });
});
