import { describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { useExplicit } from "../../src/composables/explicit";

const seen: Record<string, unknown>[] = [];

const Probe = defineComponent({
  props: {
    items: { type: Array, required: true },
    open: Boolean,
    modelValue: Object,
  },
  setup(props) {
    const explicit = useExplicit(props);
    return () => {
      seen.push(explicit.value);
      return h("div");
    };
  },
});

describe("useExplicit", () => {
  it("passes only the props the consumer set, by camel or kebab key", () => {
    seen.length = 0;
    mount(Probe, { props: { items: [1] } });
    expect(seen.at(-1)).toEqual({ items: [1] });
    expect("open" in (seen.at(-1) ?? {})).toBe(false);

    seen.length = 0;
    mount(Probe, { props: { items: [], "model-value": { a: 1 } } });
    expect(seen.at(-1)).toEqual({ items: [], modelValue: { a: 1 } });
  });

  it("passes an explicit undefined and follows a value change", async () => {
    seen.length = 0;
    const open = ref<boolean | undefined>(undefined);
    const Parent = defineComponent({
      setup: () => () => h(Probe, { items: [], open: open.value }),
    });
    mount(Parent);
    expect(seen.at(-1)).toEqual({ items: [], open: undefined });
    expect("open" in (seen.at(-1) ?? {})).toBe(true);
    open.value = true;
    await nextTick();
    expect(seen.at(-1)).toEqual({ items: [], open: true });
  });

  it("follows a prop that appears or disappears with no value change", async () => {
    seen.length = 0;
    const extra = ref<{ modelValue: undefined } | {}>({});
    const Parent = defineComponent({
      setup: () => () => h(Probe, { items: [], ...extra.value }),
    });
    mount(Parent);
    expect("modelValue" in (seen.at(-1) ?? {})).toBe(false);
    extra.value = { modelValue: undefined };
    await nextTick();
    expect("modelValue" in (seen.at(-1) ?? {})).toBe(true);
    extra.value = {};
    await nextTick();
    expect("modelValue" in (seen.at(-1) ?? {})).toBe(false);
  });
});
