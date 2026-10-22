// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container, the root
// defaults, and the one-time seed, not the proxy plumbing.
import type { FakeFile } from "#test/data/browser";

import { describe, expect, it } from "vitest";
import { accessBrowser } from "../../../app/stores/browser";

describe("accessBrowser", () => {
  it("initializes the container at the root with sorting unset", () => {
    const state = accessBrowser<FakeFile>("b1");
    expect(state.initialized).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.folders).toEqual([]);
    expect(state.files).toEqual([]);
    expect(state.path).toEqual([]);
    expect(state.sortField).toBeNull();
    expect(state.sortDirection).toBe("asc");
    expect(state.selected).toEqual(new Set());
  });

  it("seeds the container from the initial slice", () => {
    const state = accessBrowser<FakeFile>("b1", {
      path: [{ key: "media", label: "Media" }],
      sortField: "size",
      sortDirection: "desc",
      selected: new Set(["1"]),
    });
    expect(state.path).toEqual([{ key: "media", label: "Media" }]);
    expect(state.sortField).toBe("size");
    expect(state.sortDirection).toBe("desc");
    expect(state.selected).toEqual(new Set(["1"]));
    expect(state.files).toEqual([]);
  });

  it("same id shares state across calls and seeds only once", () => {
    const first = accessBrowser<FakeFile>("b1", { sortField: "size" });
    first.loading = true;
    const second = accessBrowser<FakeFile>("b1", { sortField: "name" });
    expect(second).toBe(first);
    expect(second.loading).toBe(true);
    expect(second.sortField).toBe("size");
  });

  it("different ids get independent state", () => {
    const a = accessBrowser<FakeFile>("b1");
    const b = accessBrowser<FakeFile>("b2");
    a.sortField = "size";
    expect(b.sortField).toBeNull();
  });
});
