import { describe, expect, expectTypeOf, it } from "vitest";
import { nextTick, ref } from "vue";
import { useContext } from "../../src/composables/context";
import type { Context } from "../../src/types/context";
import { withSetup } from "#test/mount/composable";

type View = { count: number };

describe("useContext", () => {
  it("wraps a view model with the component's id", async () => {
    const count = ref(1);
    const { result: ctx } = withSetup(() =>
      useContext<View>("counter", () => ({ count: count.value })),
    );
    expectTypeOf(ctx.value).toEqualTypeOf<Context<View>>();
    expect(ctx.value).toEqual({ id: "counter", count: 1 });
    count.value = 2;
    await nextTick();
    expect(ctx.value).toEqual({ id: "counter", count: 2 });
  });

  it("forwards a wrapped component's context unchanged", async () => {
    const inner = ref<Context<View> | undefined>(undefined);
    const { result: ctx } = withSetup(() =>
      useContext<View>(() => inner.value),
    );
    expectTypeOf(ctx.value).toEqualTypeOf<Context<View> | undefined>();
    expect(ctx.value).toBeUndefined();
    inner.value = { id: "counter", count: 3 };
    await nextTick();
    expect(ctx.value).toBe(inner.value);
  });
});
