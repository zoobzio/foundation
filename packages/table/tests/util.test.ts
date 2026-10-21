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

  it("gives operator types their operators and default operator", () => {
    const result = fields(fakeColumns);
    expect(result.amount).toEqual({
      label: "Amount",
      operators: ["over", "under", "is"],
      defaultOperator: "is",
    });
    expect(result.id).toEqual({
      label: "ID",
      operators: ["over", "under", "is"],
      defaultOperator: "is",
    });
    expect(result.created).toEqual({
      label: "Created",
      operators: ["before", "after", "on"],
      defaultOperator: "on",
    });
  });

  it("gives an enum column its values and a boolean column true/false", () => {
    const columns: DataTableColumn<FakeRow & { active: boolean }>[] = [
      {
        key: "status",
        label: "Status",
        type: "enum",
        enumValues: ["Active", "Inactive"],
      },
      { key: "active", label: "Active", type: "boolean" },
    ];
    expect(fields(columns)).toEqual({
      status: { label: "Status", values: ["Active", "Inactive"] },
      active: { label: "Active", values: ["true", "false"] },
    });
  });

  it("leaves a column with no type, or a type with no operators, as a bare label", () => {
    const columns: DataTableColumn<FakeRow>[] = [
      { key: "name", label: "Name" },
      { key: "status", label: "Site", type: "url" },
    ];
    expect(fields(columns)).toEqual({
      name: { label: "Name" },
      status: { label: "Site" },
    });
  });

  it("returns an empty record for no columns", () => {
    expect(fields([])).toEqual({});
  });
});
