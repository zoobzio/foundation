// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container, defaults, and
// config-driven initialization, not the proxy plumbing.
import { describe, expect, it } from "vitest";
import { accessChart } from "../../../app/stores/chart";
import type { FakeRow } from "#test/data/rows";

const config = {
  topic: "contacts",
  breakdown: {
    fields: ["status" as const, "name" as const],
    renderers: [{ type: "pie" as const }, { type: "bar" as const }],
  },
};

describe("accessChart", () => {
  it("initializes state from the first declared variant", () => {
    const state = accessChart<FakeRow>("c1", config);
    expect(state.initialized).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.variantData).toBeNull();
    expect(state.activeVariant).toBe("breakdown");
    expect(state.activeRenderer).toBe("pie");
    expect(state.activeField).toBe("status");
    expect(state.activeGroupBy).toBe("name");
    expect(state.activeBucket).toBeNull();
    expect(state.activeRange).toBeNull();
  });

  it("same id shares state across calls", () => {
    const first = accessChart<FakeRow>("c1", config);
    first.activeRenderer = "bar";
    const second = accessChart<FakeRow>("c1", config);
    expect(second).toBe(first);
    expect(second.activeRenderer).toBe("bar");
  });

  it("different ids get independent state", () => {
    const a = accessChart<FakeRow>("c1", config);
    const b = accessChart<FakeRow>("c2", config);
    a.activeRenderer = "bar";
    expect(b.activeRenderer).toBe("pie");
  });
});
