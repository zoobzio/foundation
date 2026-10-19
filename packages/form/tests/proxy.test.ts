import { describe, expect, it, vi } from "vitest";
import { makeEmitter } from "../src/emitter";
import { makeProxy } from "../src/proxy";
import { createFormState } from "../src/state";
import type { Change, Events } from "../src/types";
import { fakeConfig } from "./data";
import type { Payload } from "./data";

const make = (options = {}) => {
  const state = createFormState<Payload>(fakeConfig);
  const emitter = makeEmitter<Events<Payload>>();
  const proxy = makeProxy(state, options, emitter);
  return { state, emitter, proxy };
};

describe("makeProxy", () => {
  it("reads and writes the container without middleware", () => {
    const { state, proxy } = make();
    proxy.submitted = true;
    expect(state.submitted).toBe(true);
    expect(proxy.submitted).toBe(true);
  });

  it("passes reads through the get middleware", () => {
    const { state, proxy } = make({
      get: {
        state: {
          errors: (errors: Record<string, string>) => ({ ...errors, x: "y" }),
        },
      },
    });
    state.errors = { name: "bad" };
    expect(proxy.errors).toEqual({ name: "bad", x: "y" });
  });

  it("passes writes through the set middleware", () => {
    const { state, proxy } = make({
      set: {
        state: {
          payload: (payload: Partial<Payload>) => ({
            ...payload,
            name: payload.name?.trim(),
          }),
        },
      },
    });
    proxy.payload = { name: " Bob " };
    expect(state.payload).toEqual({ name: "Bob" });
  });

  it("emits change after the write lands", () => {
    const { emitter, proxy } = make();
    const changes: Change<Payload>[] = [];
    emitter.on("change", (change) => {
      changes.push(change);
      expect(proxy.submitting).toBe(change.after);
    });
    proxy.submitting = true;
    expect(changes).toEqual([
      { field: "submitting", before: false, after: true },
    ]);
  });

  it("skips the change object when nothing listens", () => {
    const { emitter, proxy } = make();
    const emit = vi.spyOn(emitter, "emit");
    proxy.submitting = true;
    expect(emit).not.toHaveBeenCalled();
  });

  it("passes a key outside the fields straight to the container", () => {
    const { state, proxy } = make();
    const extra = proxy as Record<string, unknown>;
    extra.ghost = 1;
    expect((state as Record<string, unknown>).ghost).toBe(1);
    expect(extra.ghost).toBe(1);
  });

  it("keeps the container's keys", () => {
    const { state, proxy } = make();
    expect(Object.keys(proxy)).toEqual(Object.keys(state));
  });
});
