// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container, config-driven
// defaults, and the one-time seed.
import { describe, expect, it } from "vitest";
import { accessTimeline } from "../../../app/stores/timeline";

describe("accessTimeline", () => {
  it("initializes the container from the config defaults", () => {
    const clauses = [{ kind: "filter" as const, key: "author", value: "ada" }];
    const state = accessTimeline("t1", { initialClauses: clauses });
    expect(state.records).toEqual([]);
    expect(state.cursor).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.appending).toBe(false);
    expect(state.initialized).toBe(false);
    expect(state.selected).toBeNull();
    expect(state.clauses).toEqual(clauses);
  });

  it("seeds the container from the initial slice", () => {
    const state = accessTimeline("t1", {}, { selected: "e5" });
    expect(state.selected).toBe("e5");
  });

  it("same id shares state across calls, seeded once", () => {
    const first = accessTimeline("t1", {}, { selected: "e5" });
    first.cursor = "3";
    const second = accessTimeline("t1", {}, { selected: "a1" });
    expect(second).toBe(first);
    expect(second.cursor).toBe("3");
    expect(second.selected).toBe("e5");
  });

  it("different ids get independent state", () => {
    const a = accessTimeline("t1");
    const b = accessTimeline("t2");
    a.selected = "x";
    expect(b.selected).toBeNull();
  });
});
