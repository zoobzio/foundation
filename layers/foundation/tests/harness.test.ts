// Smoke tests for the harness itself: alias resolution and the #imports
// shim's useState contract. Component behavior belongs in per-component
// suites, not here.
import { describe, expect, it } from "vitest";
import { useState } from "#imports";

describe("imports shim", () => {
  it("useState shares one ref per key", () => {
    const a = useState("harness-key", () => 1);
    const b = useState("harness-key", () => 2);
    expect(b).toBe(a);
    expect(b.value).toBe(1);
  });

  it("useState registry is cleared between tests", () => {
    // Same key as above — setup.ts's beforeEach must have reset it.
    const state = useState("harness-key", () => 2);
    expect(state.value).toBe(2);
  });
});
