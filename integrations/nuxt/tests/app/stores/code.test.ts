// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container and its defaults.
import { describe, expect, it } from "vitest";
import { accessCode } from "../../../app/stores/code";

describe("accessCode", () => {
  it("initializes the container empty at revision zero", () => {
    const state = accessCode("c1");
    expect(state).toEqual({
      revision: 0,
      empty: true,
      cursor: { line: 1, column: 1 },
      mounted: false,
    });
  });

  it("same id shares state across calls", () => {
    const first = accessCode("c1");
    first.revision = 3;
    const second = accessCode("c1");
    expect(second).toBe(first);
    expect(second.revision).toBe(3);
  });

  it("different ids get independent state", () => {
    const a = accessCode("c1");
    const b = accessCode("c2");
    a.empty = false;
    expect(b.empty).toBe(true);
  });
});
