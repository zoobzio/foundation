// Exercised through the shim's real useState semantics — the contract under
// test is keyed shared state and defaults, not the ref plumbing.
import { describe, expect, it } from "vitest";
import { accessBrowser } from "../../../app/stores/browser";
import { BROWSER_DEFAULT_SORT_DIRECTION } from "../../../app/constants/browser";
import type { FakeFile } from "#test/data/browser";

describe("accessBrowser", () => {
  it("initializes state with defaults", () => {
    const state = accessBrowser<FakeFile>("b1");
    expect(state.folders.value).toEqual([]);
    expect(state.files.value).toEqual([]);
    expect(state.loading.value).toBe(false);
    expect(state.initialized.value).toBe(false);
    expect(state.path.value).toEqual([]);
    expect(state.sortField.value).toBeNull();
    expect(state.sortDirection.value).toBe(BROWSER_DEFAULT_SORT_DIRECTION);
    expect(state.selected.value).toEqual(new Set());
  });

  it("same id shares state across calls", () => {
    const first = accessBrowser<FakeFile>("b1");
    first.path.value = [{ key: "media", label: "Media" }];
    const second = accessBrowser<FakeFile>("b1");
    expect(second.path).toBe(first.path);
    expect(second.path.value).toEqual([{ key: "media", label: "Media" }]);
  });

  it("different ids get independent state", () => {
    const a = accessBrowser<FakeFile>("b1");
    const b = accessBrowser<FakeFile>("b2");
    a.sortField.value = "name";
    expect(b.sortField.value).toBeNull();
  });
});
