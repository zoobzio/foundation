import { describe, expect, it } from "vitest";
import { fields } from "../src/util";
import type { DataTableColumn } from "../src/types";
import { fakeColumns } from "./data";
import type { FakeRow } from "./data";

describe("fields", () => {
  it("keys one field per column, in column order, labeled by the column", () => {
    const result = fields(fakeColumns);
    expect(Object.keys(result)).toEqual(fakeColumns.map((c) => String(c.key)));
    expect(result.name).toEqual({ label: "Name" });
  });

  it("gives a column the operators, default operator, and values it declares", () => {
    const result = fields(fakeColumns);
    expect(result.amount).toEqual({
      label: "Amount",
      operators: ["over", "under", "is"],
      defaultOperator: "is",
    });
    expect(result.created).toEqual({
      label: "Created",
      operators: ["before", "after", "on"],
      defaultOperator: "on",
    });
    expect(result.status).toEqual({
      label: "Status",
      values: ["Active", "Inactive", "Pending"],
    });
  });

  it("supplies nothing from the type: an undeclared column is a bare label", () => {
    const columns: DataTableColumn<FakeRow & { active: boolean }>[] = [
      { key: "id", label: "ID", type: "number" },
      { key: "created", label: "Created", type: "date" },
      { key: "active", label: "Active", type: "boolean" },
      { key: "status", label: "Status", type: "enum" },
      { key: "name", label: "Name" },
    ];
    expect(fields(columns)).toEqual({
      id: { label: "ID" },
      created: { label: "Created" },
      active: { label: "Active" },
      status: { label: "Status" },
      name: { label: "Name" },
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
    expect(fields(columns)).toEqual({
      created: {
        label: "Created",
        operators: ["before", "after", "on", "between"],
        defaultOperator: "between",
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
    expect(fields(columns)).toEqual({
      amount: { label: "Amount" },
      id: { label: "ID" },
    });
  });

  it("carries a column's properties beyond the ones the table reads onto its field", () => {
    const column = { key: "name", label: "Name", sortable: true, icon: "user" };
    expect(fields<FakeRow>([column as DataTableColumn<FakeRow>])).toEqual({
      name: { label: "Name", icon: "user" },
    });
  });

  it("returns an empty record for no columns", () => {
    expect(fields([])).toEqual({});
  });
});
