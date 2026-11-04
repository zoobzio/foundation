// The locale plugin: a locale switch reloads the app, so a service built
// with its labels resolved never holds a stale locale.
import { describe, expect, it } from "vitest";
import { reloadNuxtApp, useNuxtApp } from "#app";
import plugin from "../../../app/plugins/locale";

describe("locale plugin", () => {
  it("reloads the app when the prosary module raises a locale switch", async () => {
    const nuxt = useNuxtApp();
    plugin.setup?.(nuxt as never);
    expect(reloadNuxtApp).not.toHaveBeenCalled();
    await nuxt.callHook("prosary:locale", "en");
    expect(reloadNuxtApp).toHaveBeenCalledTimes(1);
  });
});
