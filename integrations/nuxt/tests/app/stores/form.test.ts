// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container, config-driven
// defaults, and the one-time seed, not the proxy plumbing.
import type { Config } from "@zoobzio/form";
import type { FakePayload } from "#test/data/form";

import { describe, expect, it } from "vitest";
import { accessForm } from "../../../app/stores/form";
import { fakeDefaults, fakeFields, fakeSchema } from "#test/data/form";

const config: Config<FakePayload> = {
  fields: fakeFields,
  schema: fakeSchema,
  defaults: fakeDefaults,
};

describe("accessForm", () => {
  it("initializes the container seeding the payload from defaults", () => {
    const state = accessForm("f1", config);
    expect(state.initialized).toBe(false);
    expect(state.payload).toEqual({ name: "Alice" });
    expect(state.payload).not.toBe(fakeDefaults);
    expect(state.errors).toEqual({});
    expect(state.touched).toEqual(new Set());
    expect(state.submitting).toBe(false);
    expect(state.submitted).toBe(false);
  });

  it("seeds the container from the initial slice over the defaults", () => {
    const state = accessForm("f1", config, {
      payload: { name: "Draft", amount: 5 },
      touched: new Set(["name"]),
    });
    expect(state.payload).toEqual({ name: "Draft", amount: 5 });
    expect(state.touched).toEqual(new Set(["name"]));
    expect(state.errors).toEqual({});
  });

  it("same id shares state across calls and seeds only once", () => {
    const first = accessForm("f1", config, { payload: { name: "Draft" } });
    first.submitting = true;
    const second = accessForm("f1", config, { payload: { name: "Other" } });
    expect(second).toBe(first);
    expect(second.submitting).toBe(true);
    expect(second.payload).toEqual({ name: "Draft" });
  });

  it("different ids get independent state", () => {
    const a = accessForm("f1", config);
    const b = accessForm("f2", config);
    a.payload = { name: "Bob" };
    expect(b.payload).toEqual({ name: "Alice" });
  });
});
