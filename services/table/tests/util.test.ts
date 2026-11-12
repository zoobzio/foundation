import { describe, expect, it } from "vitest";
import { fields } from "../src/util";
import type { DataTableColumn } from "../src/types";
import { fakeColumns } from "./data";
import type { FakeRow } from "./data";

describe("fields", () => {
  it("keys one field per column, in column order, labeled by the column", () => {
    const result = fields(fakeColumns, "UTC");
    expect(Object.keys(result)).toEqual(fakeColumns.map((c) => String(c.key)));
    expect(result.name).toEqual({ label: "Name" });
  });

  it("gives a column the operators, default operator, and values it declares", () => {
    const result = fields(fakeColumns, "UTC");
    expect(result.amount).toEqual({
      label: "Amount",
      operators: ["over", "under", "is"],
      defaultOperator: "is",
    });
    expect(result.created).toEqual({
      label: "Created",
      operators: ["before", "after", "on"],
      defaultOperator: "on",
      values: expect.any(Function),
    });
    expect(result.status).toEqual({
      label: "Status",
      values: ["Active", "Inactive", "Pending"],
    });
  });

  it("supplies nothing from the type but date values: an undeclared column is a bare label", () => {
    const columns: DataTableColumn<FakeRow & { active: boolean }>[] = [
      { key: "id", label: "ID", type: "number" },
      { key: "active", label: "Active", type: "boolean" },
      { key: "status", label: "Status", type: "enum" },
      { key: "name", label: "Name" },
    ];
    expect(fields(columns, "UTC")).toEqual({
      id: { label: "ID" },
      active: { label: "Active" },
      status: { label: "Status" },
      name: { label: "Name" },
    });
  });

  it("gives a date or datetime column without values the days of the zone", () => {
    const columns: DataTableColumn<FakeRow & { seen: string }>[] = [
      { key: "created", label: "Created", type: "date" },
      { key: "seen", label: "Seen", type: "datetime" },
      { key: "name", label: "Name", type: "text" },
    ];
    const result = fields(columns, "UTC");
    expect(result.created).toEqual({
      label: "Created",
      values: expect.any(Function),
    });
    expect(result.seen).toEqual({
      label: "Seen",
      values: expect.any(Function),
    });
    expect(result.name).toEqual({ label: "Name" });
    const values = result.created!.values as (term: string) => string[];
    expect(values("2025-03")).toHaveLength(31);
    expect(values("2025-03")[0]).toBe("2025-03-31");
  });

  it("lets a date column's own values win over the days", () => {
    const provider = (term: string) => [term];
    const columns: DataTableColumn<FakeRow & { seen: string }>[] = [
      {
        key: "created",
        label: "Created",
        type: "date",
        values: ["2025-01-01"],
      },
      { key: "seen", label: "Seen", type: "datetime", values: provider },
    ];
    expect(fields(columns, "UTC")).toEqual({
      created: { label: "Created", values: ["2025-01-01"] },
      seen: { label: "Seen", values: provider },
    });
  });

  it("takes any vocabulary: a provider, custom operators, custom values", () => {
    const provider = (term: string) => [term];
    const columns: DataTableColumn<FakeRow & { active: boolean }>[] = [
      {
        key: "created",
        label: "Created",
        type: "date",
        operators: ["before", "after", "on", "between"],
        defaultOperator: "between",
      },
      { key: "name", label: "Name", type: "text", operators: ["contains"] },
      {
        key: "active",
        label: "Active",
        type: "boolean",
        values: ["Yes", "No"],
      },
      { key: "status", label: "Owner", values: provider },
    ];
    expect(fields(columns, "UTC")).toEqual({
      created: {
        label: "Created",
        operators: ["before", "after", "on", "between"],
        defaultOperator: "between",
        values: expect.any(Function),
      },
      name: { label: "Name", operators: ["contains"] },
      active: { label: "Active", values: ["Yes", "No"] },
      status: { label: "Owner", values: provider },
    });
  });

  it("drops an empty operator list and the default that goes with it", () => {
    const columns: DataTableColumn<FakeRow>[] = [
      { key: "amount", label: "Amount", operators: [], defaultOperator: "is" },
      { key: "id", label: "ID", defaultOperator: "is" },
    ];
    expect(fields(columns, "UTC")).toEqual({
      amount: { label: "Amount" },
      id: { label: "ID" },
    });
  });

  it("carries a column's properties beyond the ones the table reads onto its field", () => {
    const column = { key: "name", label: "Name", sortable: true, icon: "user" };
    expect(
      fields<FakeRow>([column as DataTableColumn<FakeRow>], "UTC"),
    ).toEqual({
      name: { label: "Name", icon: "user" },
    });
  });

  it("keeps a column's link and widths off its field", () => {
    const column: DataTableColumn<FakeRow> = {
      key: "name",
      label: "Name",
      link: (row) => `/rows/${row.id}`,
      width: 200,
      minWidth: 80,
    };
    expect(fields([column], "UTC")).toEqual({ name: { label: "Name" } });
  });

  it("returns an empty record for no columns", () => {
    expect(fields([], "UTC")).toEqual({});
  });
});
