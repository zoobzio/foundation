import { describe, it, expect } from "vitest";
import { Command } from "#foundation/utils/command";
const { filter } = Command;

const groups = [
  {
    key: "actions",
    label: "Actions",
    items: [
      { value: "edit", label: "Edit", count: 5 },
      { value: "delete", label: "Delete", count: 0 },
      { value: "copy", label: "Copy" },
    ],
  },
  {
    key: "empty",
    label: "Empty",
    items: [],
  },
];

describe("filter", () => {
  it("hides items with count=0 when not selected", () => {
    const result = filter(groups, "", new Set(), false);
    const items = result.flatMap((g) => g.items);
    expect(items.map((i) => i.value)).toEqual(["edit", "copy"]);
  });

  it("shows items with count=0 when selected", () => {
    const result = filter(groups, "", new Set(["delete"]), false);
    const items = result.flatMap((g) => g.items);
    expect(items.map((i) => i.value)).toEqual(["edit", "delete", "copy"]);
  });

  it("filters by search term", () => {
    const result = filter(groups, "ed", new Set(), false);
    const items = result.flatMap((g) => g.items);
    expect(items.map((i) => i.value)).toEqual(["edit"]);
  });

  it("search is case-insensitive", () => {
    const result = filter(groups, "EDIT", new Set(), false);
    const items = result.flatMap((g) => g.items);
    expect(items.map((i) => i.value)).toEqual(["edit"]);
  });

  it("removes empty groups", () => {
    const result = filter(groups, "", new Set(), false);
    expect(result.map((g) => g.key)).toEqual(["actions"]);
  });

  it("skips all local filtering when filtered=true", () => {
    const result = filter(groups, "ed", new Set(), true);
    // Only filters out empty groups
    expect(result).toHaveLength(1);
    expect(result[0].items).toHaveLength(3);
  });

  it("returns empty when nothing matches search", () => {
    const result = filter(groups, "zzzzz", new Set(), false);
    expect(result).toHaveLength(0);
  });

  it("items without count are always shown", () => {
    const result = filter(groups, "", new Set(), false);
    const copy = result.flatMap((g) => g.items).find((i) => i.value === "copy");
    expect(copy).toBeDefined();
  });
});
