import { describe, expect, it } from "vitest";
import { change, sortFolders } from "../src/util";
import { fakeFolders } from "./data";
import type { FakeFile } from "./data";

describe("change", () => {
  it("builds the change object of a field", () => {
    expect(change<FakeFile>("sortField", null, "name")).toEqual({
      field: "sortField",
      before: null,
      after: "name",
    });
  });
});

describe("sortFolders", () => {
  it("returns a copy in alphabetical label order", () => {
    const sorted = sortFolders(fakeFolders);
    expect(sorted.map((f) => f.label)).toEqual(["Archive", "Drafts", "Media"]);
    expect(fakeFolders.map((f) => f.label)).toEqual([
      "Media",
      "Archive",
      "Drafts",
    ]);
  });

  it("handles an empty list", () => {
    expect(sortFolders([])).toEqual([]);
  });
});
