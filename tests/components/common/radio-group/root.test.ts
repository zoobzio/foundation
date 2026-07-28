import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { rekaStubs } from "#test/stubs";
import Root from "#foundation/components/common/radio-group/root.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Root, { props, slots, global: { stubs: rekaStubs("RadioGroupRoot") } });

describe("common/radio-group/Root", () => {
  it("renders with f-radio-group-root class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-radio-group-root");
  });

  it("leaves modelValue unbound when absent", () => {
    const wrapper = factory();
    expect(wrapper.attributes("modelvalue")).toBeUndefined();
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ disabled: true, orientation: "horizontal" });
    expect(wrapper.attributes("disabled")).toBe("true");
    expect(wrapper.attributes("orientation")).toBe("horizontal");
  });

  it("binds controlled modelValue down", () => {
    const wrapper = factory({ modelValue: "banana" });
    expect(wrapper.attributes("modelvalue")).toBe("banana");
  });

  it("re-emits update:modelValue and tracks it while uncontrolled", async () => {
    const wrapper = factory();
    wrapper
      .findComponent({ name: "RadioGroupRoot" })
      .vm.$emit("update:modelValue", "banana");
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([["banana"]]);
    expect(wrapper.attributes("modelvalue")).toBe("banana");
  });

  it("stays pinned to the modelValue prop while controlled", async () => {
    const wrapper = factory({ modelValue: "apple" });
    wrapper
      .findComponent({ name: "RadioGroupRoot" })
      .vm.$emit("update:modelValue", "banana");
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([["banana"]]);
    expect(wrapper.attributes("modelvalue")).toBe("apple");
  });

  it("exposes a writable model ref on ctx", async () => {
    const wrapper = factory();
    wrapper.vm.ctx.modelValue.value = "cherry";
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([["cherry"]]);
    expect(wrapper.attributes("modelvalue")).toBe("cherry");
  });

  it("preserves reka's true-defaults by not forwarding cast booleans", () => {
    const wrapper = factory();
    expect(wrapper.attributes("loop")).toBeUndefined();
  });

  it("forwards explicitly-set boolean overrides", () => {
    const wrapper = factory({ loop: false });
    expect(wrapper.attributes("loop")).toBe("false");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the radiogroup role", () => {
    const wrapper = factory({ aria: { required: true } });
    expect(wrapper.attributes("aria-required")).toBe("true");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>items</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
