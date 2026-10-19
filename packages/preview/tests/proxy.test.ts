import { describe, expect, it, vi } from "vitest";
import { makeEmitter } from "../src/emitter";
import { makeProxy } from "../src/proxy";
import { createPreviewState } from "../src/state";
import type { Change, Events } from "../src/types";
import { fakeRows } from "./data";
import type { FakeRow } from "./data";

const make = (options = {}) => {
  const state = createPreviewState<FakeRow>();
  const emitter = makeEmitter<Events<FakeRow>>();
  const proxy = makeProxy(state, options, emitter);
  return { state, emitter, proxy };
};

describe("makeProxy", () => {
  it("reads and writes the container without middleware", () => {
    const { state, proxy } = make();
    proxy.data = fakeRows[0] ?? null;
    expect(state.data).toEqual(fakeRows[0]);
    expect(proxy.data).toEqual(fakeRows[0]);
  });

  it("passes reads through the get middleware", () => {
    const { state, proxy } = make({
      get: { state: { loading: (loading: boolean) => !loading } },
    });
    state.loading = false;
    expect(proxy.loading).toBe(true);
  });

  it("passes writes through the set middleware", () => {
    const { state, proxy } = make({
      set: {
        state: {
          data: (data: FakeRow | null) =>
            data ? { ...data, name: data.name.toUpperCase() } : null,
        },
      },
    });
    proxy.data = fakeRows[0] ?? null;
    expect(state.data?.name).toBe("ALICE");
  });

  it("emits change after the write lands", () => {
    const { emitter, proxy } = make();
    const changes: Change<FakeRow>[] = [];
    emitter.on("change", (change) => {
      changes.push(change);
      expect(proxy.loading).toBe(change.after);
    });
    proxy.loading = true;
    expect(changes).toEqual([{ field: "loading", before: false, after: true }]);
  });

  it("skips the change object when nothing listens", () => {
    const { emitter, proxy } = make();
    const emit = vi.spyOn(emitter, "emit");
    proxy.loading = true;
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
