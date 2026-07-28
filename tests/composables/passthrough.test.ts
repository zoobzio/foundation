import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { usePassthrough } from "#foundation/composables/passthrough";

// Deep-merge semantics are covered by tests/utils/passthrough.test.ts; these
// verify the composable surface: a reactive, manifest-shaped merge of the
// user `pt` layer over the local recipes.
describe("usePassthrough", () => {
  it("returns the local recipes when pt is omitted", () => {
    const settings = usePassthrough(() => ({
      recipes: { root: { open: false }, trigger: {} },
    }));
    expect(settings.value).toEqual({ root: { open: false }, trigger: {} });
  });

  it("merges user overrides over the local recipes per key", () => {
    const settings = usePassthrough(() => ({
      pt: { root: { open: true, class: "custom" } },
      recipes: { root: { open: false, disabled: true }, trigger: {} },
    }));
    expect(settings.value.root).toEqual({
      open: true,
      class: "custom",
      disabled: true,
    });
  });

  it("replaces local handlers wholesale on user override", () => {
    const local = () => "local";
    const user = () => "user";
    const settings = usePassthrough(() => ({
      pt: { root: { "onUpdate:open": user } },
      recipes: { root: { "onUpdate:open": local } },
    }));
    expect(settings.value.root["onUpdate:open"]).toBe(user);
  });

  it("replaces an iterated part callback wholesale on user override", () => {
    const local = (obj: { value: string }) => ({ value: obj.value });
    const user = (obj: { value: string }) => ({ value: obj.value, disabled: true });
    const settings = usePassthrough(() => ({
      pt: { item: user },
      recipes: { item: local },
    }));
    expect(settings.value.item).toBe(user);
  });

  it("tracks the source reactively", () => {
    const open = ref(false);
    const settings = usePassthrough(() => ({
      recipes: { root: { open: open.value } },
    }));
    expect(settings.value.root.open).toBe(false);
    open.value = true;
    expect(settings.value.root.open).toBe(true);
  });
});
