import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { rekaStubs } from "#test/stubs";
import Root from "#foundation/components/common/toggle-group/root.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Root, { props, slots, global: { stubs: rekaStubs("ToggleGroupRoot") } });

describe("common/toggle-group/Root", () => {
  it("renders with f-toggle-group-root class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-toggle-group-root");
  });

  it("leaves modelValue unbound when absent", () => {
    const wrapper = factory();
    expect(wrapper.attributes("modelvalue")).toBeUndefined();
  });

  it("preserves reka's true-defaults by not forwarding cast booleans", () => {
    const wrapper = factory();
    expect(wrapper.attributes("rovingfocus")).toBeUndefined();
    expect(wrapper.attributes("loop")).toBeUndefined();
  });

  it("forwards explicitly-set boolean overrides", () => {
    const wrapper = factory({ rovingFocus: false, loop: false });
    expect(wrapper.attributes("rovingfocus")).toBe("false");
    expect(wrapper.attributes("loop")).toBe("false");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ type: "single", disabled: true });
    expect(wrapper.attributes("type")).toBe("single");
    expect(wrapper.attributes("disabled")).toBe("true");
  });

  it("binds controlled modelValue down", () => {
    const wrapper = factory({ modelValue: "banana" });
    expect(wrapper.attributes("modelvalue")).toBe("banana");
  });

  it("re-emits update:modelValue and tracks it while uncontrolled", async () => {
    const wrapper = factory();
    wrapper
      .findComponent({ name: "ToggleGroupRoot" })
      .vm.$emit("update:modelValue", "banana");
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([["banana"]]);
    expect(wrapper.attributes("modelvalue")).toBe("banana");
  });

  it("stays pinned to the modelValue prop while controlled", async () => {
    const wrapper = factory({ modelValue: "apple" });
    wrapper
      .findComponent({ name: "ToggleGroupRoot" })
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

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the group role", () => {
    const wrapper = factory({ aria: { label: "View mode" } });
    expect(wrapper.attributes("aria-label")).toBe("View mode");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>items</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
