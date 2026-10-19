// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container and its defaults,
// not the proxy plumbing.
import { describe, expect, it } from "vitest";
import { accessPreview } from "../../../app/stores/preview";
import type { FakeRow } from "#test/data/table";

describe("accessPreview", () => {
  it("initializes state with defaults", () => {
    const state = accessPreview<FakeRow>("p1");
    expect(state.initialized).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.data).toBeNull();
  });

  it("same id shares state across calls", () => {
    const first = accessPreview<FakeRow>("p1");
    first.loading = true;
    const second = accessPreview<FakeRow>("p1");
    expect(second).toBe(first);
    expect(second.loading).toBe(true);
  });

  it("different ids get independent state", () => {
    const a = accessPreview<FakeRow>("p1");
    const b = accessPreview<FakeRow>("p2");
    a.loading = true;
    expect(b.loading).toBe(false);
  });
});
