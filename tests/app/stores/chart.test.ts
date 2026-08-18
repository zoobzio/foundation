// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is keyed shared state, defaults, and config-driven
// initialization, not the ref plumbing.
import { describe, expect, it } from "vitest";
import { accessChart } from "../../../app/stores/chart";
import type { FakeRow } from "#test/data/table";

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
    expect(state.initialized.value).toBe(false);
    expect(state.loading.value).toBe(false);
    expect(state.variantData.value).toBeNull();
    expect(state.activeVariant.value).toBe("breakdown");
    expect(state.activeRenderer.value).toBe("pie");
    expect(state.activeField.value).toBe("status");
    expect(state.activeGroupBy.value).toBe("name");
  });

  it("same id shares state across calls", () => {
    const first = accessChart<FakeRow>("c1", config);
    first.activeRenderer.value = "bar";
    const second = accessChart<FakeRow>("c1", config);
    expect(second.activeRenderer).toBe(first.activeRenderer);
    expect(second.activeRenderer.value).toBe("bar");
  });

  it("different ids get independent state", () => {
    const a = accessChart<FakeRow>("c1", config);
    const b = accessChart<FakeRow>("c2", config);
    a.activeRenderer.value = "bar";
    expect(b.activeRenderer.value).toBe("pie");
  });
});
