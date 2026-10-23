import { describe, expect, expectTypeOf, it } from "vitest";
import { nextTick, ref } from "vue";
import { usePassthrough } from "../../src/composables/passthrough";
import type { Passthrough, PT } from "../../src/types/passthrough";
import { withSetup } from "#test/mount/composable";

type Parts = {
  link: (item: { id: string }) => { as?: string; class?: string };
  root: { class?: string };
};

describe("usePassthrough", () => {
  it("resolves recipes under the user's pt into a full manifest", () => {
    const pt = ref<PT<Parts> | undefined>({ root: { class: "user" } });
    const { result: settings } = withSetup(() =>
      usePassthrough<Parts>(() => ({
        pt: pt.value,
        recipes: { link: () => ({ as: "a" }), root: { class: "local" } },
      })),
    );
    expectTypeOf(settings.value).toEqualTypeOf<Passthrough<Parts>>();
    expect(settings.value.root).toEqual({ class: "user" });
    expect(settings.value.link({ id: "x" })).toEqual({ as: "a" });
  });

  it("lays a wrapper's partial manifest under the user's pt", async () => {
    const pt = ref<PT<Parts> | undefined>(undefined);
    const { result: layered } = withSetup(() =>
      usePassthrough<Parts>(() => ({
        pt: pt.value,
        layer: { link: () => ({ as: "span" }) },
      })),
    );
    expectTypeOf(layered.value).toEqualTypeOf<PT<Passthrough<Parts>>>();
    expect(layered.value.root).toBeUndefined();
    expect(layered.value.link?.({ id: "x" })).toEqual({ as: "span" });

    pt.value = { link: () => ({ class: "user" }), root: { class: "r" } };
    await nextTick();
    expect(layered.value.root).toEqual({ class: "r" });
    expect(layered.value.link?.({ id: "x" })).toEqual({
      as: "span",
      class: "user",
    });
  });
});
