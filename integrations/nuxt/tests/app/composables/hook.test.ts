// The id-scoped subscription: a listener fires for its own instance's
// events only, and every subscription leaves with the scope.
import { describe, expect, it, vi } from "vitest";
import { effectScope } from "vue";
import { useNuxtApp } from "#app";
import { useHooks } from "../../../app/composables/hook";

describe("useHooks", () => {
  it("fires a listener for events carrying its id only", async () => {
    const updated = vi.fn();
    const scope = effectScope();
    scope.run(() => useHooks("users", { "table:updated": updated }));

    const nuxt = useNuxtApp();
    await nuxt.callHook("table:updated", { id: "users", total: 3 });
    await nuxt.callHook("table:updated", { id: "orders", total: 9 });
    expect(updated.mock.calls).toEqual([[{ id: "users", total: 3 }]]);
  });

  it("registers one listener per hook named and skips undefined ones", async () => {
    const updated = vi.fn();
    const filtered = vi.fn();
    const scope = effectScope();
    scope.run(() =>
      useHooks("users", {
        "table:updated": updated,
        "table:filtered": filtered,
        "form:submitted": undefined,
      }),
    );

    const nuxt = useNuxtApp();
    await nuxt.callHook("table:filtered", {
      id: "users",
      query: "a",
      filters: [],
    });
    expect(updated).not.toHaveBeenCalled();
    expect(filtered.mock.calls).toEqual([
      [{ id: "users", query: "a", filters: [] }],
    ]);
  });

  it("removes its listeners when the scope is disposed", async () => {
    const updated = vi.fn();
    const scope = effectScope();
    scope.run(() => useHooks("users", { "table:updated": updated }));
    scope.stop();

    await useNuxtApp().callHook("table:updated", { id: "users", total: 1 });
    expect(updated).not.toHaveBeenCalled();
  });
});
