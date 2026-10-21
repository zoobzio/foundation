import { describe, expect, it, vi } from "vitest";
import { makeEmitter } from "../src/emitter";
import { makeProxy } from "../src/proxy";
import type { Change, ChangeEvents, Fields, Options } from "../src/types";

type Shape = { page: number; query: string; tags: Set<string> };

const FIELDS: Fields<Shape> = { page: null, query: null, tags: null };

const make = (options: Options<Shape> = {}) => {
  const state: Shape = { page: 1, query: "", tags: new Set() };
  const emitter = makeEmitter<ChangeEvents<Shape>>();
  const proxy = makeProxy(state, FIELDS, options, emitter);
  return { state, emitter, proxy };
};

describe("makeProxy", () => {
  it("reads and writes the container without middleware", () => {
    const { state, proxy } = make();
    proxy.page = 3;
    expect(state.page).toBe(3);
    expect(proxy.page).toBe(3);
  });

  it("passes reads through the get middleware", () => {
    const { state, proxy } = make({
      get: { state: { page: (page) => page * 10 } },
    });
    state.page = 2;
    expect(proxy.page).toBe(20);
  });

  it("passes writes through the set middleware", () => {
    const { state, proxy } = make({
      set: { state: { query: (query) => query.trim() } },
    });
    proxy.query = " acme ";
    expect(state.query).toBe("acme");
  });

  it("emits change after the write lands", () => {
    const { emitter, proxy } = make();
    const changes: Change<Shape>[] = [];
    emitter.on("change", (change) => {
      changes.push(change);
      expect(proxy.page).toBe(change.after);
    });
    proxy.page = 2;
    expect(changes).toEqual([{ field: "page", before: 1, after: 2 }]);
  });

  it("reports the value after the set middleware in the change", () => {
    const { emitter, proxy } = make({
      set: { state: { query: (query) => query.trim() } },
    });
    const listener = vi.fn();
    emitter.on("change", listener);
    proxy.query = " acme ";
    expect(listener).toHaveBeenCalledWith({
      field: "query",
      before: "",
      after: "acme",
    });
  });

  it("skips the change object when nothing listens", () => {
    const { emitter, proxy } = make();
    const emit = vi.spyOn(emitter, "emit");
    proxy.page = 2;
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
