// Exercised through the shim's real useState semantics — the contract under
// test is the keyed shared container and its defaults, not the proxy
// plumbing.
import { describe, expect, it } from "vitest";
import { accessBrowser } from "../../../app/stores/browser";
import { BROWSER_DEFAULT_SORT_DIRECTION } from "../../../app/constants/browser";
import type { FakeFile } from "#test/data/browser";

describe("accessBrowser", () => {
  it("initializes state with defaults", () => {
    const state = accessBrowser<FakeFile>("b1");
    expect(state.folders).toEqual([]);
    expect(state.files).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.initialized).toBe(false);
    expect(state.path).toEqual([]);
    expect(state.sortField).toBeNull();
    expect(state.sortDirection).toBe(BROWSER_DEFAULT_SORT_DIRECTION);
    expect(state.selected).toEqual(new Set());
  });

  it("same id shares state across calls", () => {
    const first = accessBrowser<FakeFile>("b1");
    first.path = [{ key: "media", label: "Media" }];
    const second = accessBrowser<FakeFile>("b1");
    expect(second).toBe(first);
    expect(second.path).toEqual([{ key: "media", label: "Media" }]);
  });

  it("different ids get independent state", () => {
    const a = accessBrowser<FakeFile>("b1");
    const b = accessBrowser<FakeFile>("b2");
    a.sortField = "name";
    expect(b.sortField).toBeNull();
  });
});
