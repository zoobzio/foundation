import { describe, expect, it } from "vitest";
import { crumbItems } from "../../src/utils/browser";
import { makeBrowser } from "#test/mount/browser";

describe("crumbItems", () => {
  it("starts at the root crumb with index zero", () => {
    const { service } = makeBrowser({ rootLabel: "Assets" });
    expect(crumbItems(service)).toEqual([
      { key: "", label: "Assets", index: 0 },
    ]);
  });

  it("indexes each trail crumb for navigate", () => {
    const { service, state } = makeBrowser();
    state.path = [
      { key: "media", label: "Media" },
      { key: "2025", label: "2025" },
    ];
    expect(crumbItems(service)).toEqual([
      { key: "", label: "Home", index: 0 },
      { key: "media", label: "Media", index: 1 },
      { key: "media/2025", label: "2025", index: 2 },
    ]);
  });
});
