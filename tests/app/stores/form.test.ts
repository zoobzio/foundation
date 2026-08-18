// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is keyed shared state, defaults, and config-driven
// initialization, not the ref plumbing.
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
    expect(state.initialized.value).toBe(false);
    expect(state.payload.value).toEqual({ name: "Alice" });
    expect(state.errors.value).toEqual({});
    expect(state.touched.value).toEqual(new Set());
    expect(state.submitting.value).toBe(false);
    expect(state.submitted.value).toBe(false);
  });

  it("same id shares state across calls", () => {
    const first = accessForm<Payload>("f1", config);
    first.payload.value = { name: "Bob" };
    const second = accessForm<Payload>("f1", config);
    expect(second.payload).toBe(first.payload);
    expect(second.payload.value).toEqual({ name: "Bob" });
  });

  it("different ids get independent state", () => {
    const a = accessForm<Payload>("f1", config);
    const b = accessForm<Payload>("f2", config);
    a.submitting.value = true;
    expect(b.submitting.value).toBe(false);
  });
});
