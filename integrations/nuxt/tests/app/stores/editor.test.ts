// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container and its defaults.
import { describe, expect, it } from "vitest";
import { accessEditor } from "../../../app/stores/editor";

describe("accessEditor", () => {
  it("initializes the container empty at revision zero", () => {
    const state = accessEditor("e1");
    expect(state).toEqual({
      revision: 0,
      empty: true,
      active: {},
      mounted: false,
    });
  });

  it("same id shares state across calls", () => {
    const first = accessEditor("e1");
    first.revision = 3;
    const second = accessEditor("e1");
    expect(second).toBe(first);
    expect(second.revision).toBe(3);
  });

  it("different ids get independent state", () => {
    const a = accessEditor("e1");
    const b = accessEditor("e2");
    a.empty = false;
    expect(b.empty).toBe(true);
  });
});
