import { describe, expect, it } from "vitest";
import { sortFolders } from "../src/util";
import { fakeFolders } from "./data";

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
