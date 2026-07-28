import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { rekaStubs } from "#test/stubs";
import Root from "#foundation/components/common/listbox/root.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Root, { props, slots, global: { stubs: rekaStubs("ListboxRoot") } });

describe("common/listbox/Root", () => {
  it("renders with f-listbox-root class", () => {
    expect(factory().classes()).toContain("f-listbox-root");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ disabled: true, multiple: true });
    expect(wrapper.attributes("disabled")).toBe("true");
    expect(wrapper.attributes("multiple")).toBe("true");
  });

  it("binds the controlled model down", () => {
    const wrapper = factory({ modelValue: "apple" });
    expect(wrapper.attributes("modelvalue")).toBe("apple");
  });

  it("re-emits update:modelValue in reka vocabulary and tracks it", async () => {
    const wrapper = factory();
    wrapper
      .findComponent({ name: "ListboxRoot" })
      .vm.$emit("update:modelValue", "banana");
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([["banana"]]);
    expect(wrapper.attributes("modelvalue")).toBe("banana");
  });

  it("passes an array payload through unchanged (multiple)", async () => {
    const wrapper = factory({ multiple: true });
    wrapper
      .findComponent({ name: "ListboxRoot" })
      .vm.$emit("update:modelValue", ["apple", "cherry"]);
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([[["apple", "cherry"]]]);
  });

  it("exposes a writable model ref on ctx", async () => {
    const wrapper = factory();
    wrapper.vm.ctx.modelValue.value = "cherry";
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([["cherry"]]);
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>options</b>" }).find("b").exists()).toBe(true);
  });
});
