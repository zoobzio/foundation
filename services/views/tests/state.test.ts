import { describe, expect, it } from "vitest";
import { createViewsState } from "../src/state";
import { all, fakeConfig, mine, schema } from "./data";

describe("createViewsState", () => {
  it("holds the config's views as system views, the first active", () => {
    const state = createViewsState(fakeConfig);
    expect(state.views.map((view) => [view.id, view.origin])).toEqual([
      ["all", "system"],
      ["recent", "system"],
    ]);
    expect(state.active).toBe("all");
    expect(state).toMatchObject({
      stale: [],
      pending: null,
      loading: false,
      saving: false,
      initialized: false,
    });
  });

  it("reads each payload through the schema", () => {
    const state = createViewsState({
      schema,
      views: [{ id: "bare", name: "Bare", payload: schema.parse({}) }],
    });
    expect(state.views[0]?.payload).toEqual(all.payload);
    expect(() =>
      createViewsState({
        schema,
        // @ts-expect-error a payload outside the schema
        views: [{ id: "bad", name: "Bad", payload: { size: "ten" } }],
      }),
    ).toThrow("expected number");
  });

  it("takes the initial view and a view's own origin", () => {
    const state = createViewsState({
      ...fakeConfig,
      views: [all, mine],
      initial: "mine",
    });
    expect(state.active).toBe("mine");
    expect(state.views[1]?.origin).toBe("user");
  });

  it("has no active view without views", () => {
    expect(createViewsState({ schema }).active).toBeNull();
  });
});
