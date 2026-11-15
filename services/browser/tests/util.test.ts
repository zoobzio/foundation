import { describe, expect, it } from "vitest";
import { fields, prune } from "../src/util";
import type { BrowserColumn } from "../src/types";
import { fakeFileColumns } from "./data";
import type { FakeFile } from "./data";

describe("prune", () => {
  it("keeps the keys still listed", () => {
    expect(prune(new Set(["1", "2", "3"]), ["3", "1", "9"])).toEqual(
      new Set(["1", "3"]),
    );
  });

  it("returns the set itself where nothing is lost", () => {
    const selected = new Set(["1"]);
    expect(prune(selected, ["1", "2"])).toBe(selected);
  });
});

describe("fields", () => {
  it("keys one field per column, in column order, labeled by the column", () => {
    const result = fields(fakeFileColumns, "UTC");
    expect(Object.keys(result)).toEqual(["name", "size", "modified"]);
    expect(result.name).toEqual({ label: "Name" });
    expect(result.size).toEqual({ label: "Size" });
  });

  it("gives a column the operators, default operator, and values it declares", () => {
    const columns: BrowserColumn<FakeFile>[] = [
      {
        key: "size",
        label: "Size",
        operators: ["over", "under"],
        defaultOperator: "over",
      },
      { key: "name", label: "Name", values: ["logo.svg", "hero.png"] },
      { key: "id", label: "ID", defaultOperator: "is" },
    ];
    expect(fields(columns, "UTC")).toEqual({
      size: {
        label: "Size",
        operators: ["over", "under"],
        defaultOperator: "over",
      },
      name: { label: "Name", values: ["logo.svg", "hero.png"] },
      id: { label: "ID" },
    });
  });

  it("gives a date or datetime column without values the days of the zone", () => {
    const own = ["today"];
    const columns: BrowserColumn<FakeFile & { seen: string; made: string }>[] =
      [
        { key: "modified", label: "Modified", type: "date" },
        { key: "seen", label: "Seen", type: "datetime" },
        { key: "made", label: "Made", type: "date", values: own },
      ];
    const result = fields(columns, "UTC");
    expect(result.modified).toEqual({
      label: "Modified",
      values: expect.any(Function),
    });
    expect(result.seen?.values).toBe(result.modified?.values);
    expect(result.made?.values).toBe(own);
  });

  it("carries a column's own properties onto its field", () => {
    const column: BrowserColumn<FakeFile> & { icon: string } = {
      key: "name",
      label: "Name",
      sortable: true,
      icon: "folder",
    };
    expect(fields([column], "UTC")).toEqual({
      name: { label: "Name", icon: "folder" },
    });
  });
});
