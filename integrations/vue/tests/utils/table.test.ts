import { describe, expect, it } from "vitest";
import { columnOption } from "../../src/utils/table";
import { fakeColumns } from "#test/data/table";
import { makeTable } from "#test/mount/table";

const col = (key: string) => {
  const found = fakeColumns.find((c) => String(c.key) === key);
  if (!found) throw new Error(`no fake column ${key}`);
  return found;
};

describe("columnOption", () => {
  it("maps a column to an option, disabled when pinned", () => {
    const { service } = makeTable({ pinnedColumns: ["id"] });
    expect(columnOption(service, col("id"))).toEqual({
      value: "id",
      label: "ID",
      disabled: true,
    });
    expect(columnOption(service, col("name")).disabled).toBe(false);
  });

  it("carries a column's properties beyond the ones the table reads onto the option", () => {
    const { service } = makeTable();
    const column = { ...col("name"), icon: "user" };
    expect(columnOption(service, column)).toEqual({
      value: "name",
      label: "Name",
      disabled: false,
      icon: "user",
    });
  });
});
