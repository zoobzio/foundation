// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container, defaults, and
// config-driven initialization, not the proxy plumbing.
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { accessForm } from "../../../app/stores/form";

type Payload = { name: string; amount: number };

const config = {
  title: "Contact",
  fields: [],
  schema: z.object({ name: z.string(), amount: z.number() }),
  defaults: { name: "Alice" },
};

describe("accessForm", () => {
  it("initializes state seeding payload from defaults", () => {
    const state = accessForm<Payload>("f1", config);
    expect(state.initialized).toBe(false);
    expect(state.payload).toEqual({ name: "Alice" });
    expect(state.errors).toEqual({});
    expect(state.touched).toEqual(new Set());
    expect(state.submitting).toBe(false);
    expect(state.submitted).toBe(false);
  });

  it("same id shares state across calls", () => {
    const first = accessForm<Payload>("f1", config);
    first.payload = { name: "Bob" };
    const second = accessForm<Payload>("f1", config);
    expect(second).toBe(first);
    expect(second.payload).toEqual({ name: "Bob" });
  });

  it("different ids get independent state", () => {
    const a = accessForm<Payload>("f1", config);
    const b = accessForm<Payload>("f2", config);
    a.submitting = true;
    expect(b.submitting).toBe(false);
  });
});
