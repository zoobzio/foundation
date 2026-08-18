// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is keyed shared state and defaults, not the ref
// plumbing.
import { describe, expect, it } from "vitest";
import { accessPreview } from "../../../app/stores/preview";
import type { FakeRow } from "#test/data/table";

describe("accessPreview", () => {
  it("initializes state with defaults", () => {
    const state = accessPreview<FakeRow>("p1");
    expect(state.initialized.value).toBe(false);
    expect(state.loading.value).toBe(false);
    expect(state.data.value).toBeNull();
  });

  it("same id shares state across calls", () => {
    const first = accessPreview<FakeRow>("p1");
    first.loading.value = true;
    const second = accessPreview<FakeRow>("p1");
    expect(second.loading).toBe(first.loading);
    expect(second.loading.value).toBe(true);
  });

  it("different ids get independent state", () => {
    const a = accessPreview<FakeRow>("p1");
    const b = accessPreview<FakeRow>("p2");
    a.loading.value = true;
    expect(b.loading.value).toBe(false);
  });
});
