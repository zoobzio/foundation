import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { rekaStubs } from "#test/stubs";
import Root from "#foundation/components/common/select/root.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Root, { props, slots, global: { stubs: rekaStubs("SelectRoot") } });

describe("common/select/Root", () => {
  it("renders with f-select-root class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-select-root");
  });

  it("binds open=false by default (useModel fallback)", () => {
    const wrapper = factory();
    expect(wrapper.attributes("open")).toBe("false");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ disabled: true, name: "fruit" });
    expect(wrapper.attributes("disabled")).toBe("true");
    expect(wrapper.attributes("name")).toBe("fruit");
  });

  it("binds controlled model props down", () => {
    const wrapper = factory({ modelValue: "apple", open: true });
    expect(wrapper.attributes("modelvalue")).toBe("apple");
    expect(wrapper.attributes("open")).toBe("true");
  });

  it("re-emits update:open and tracks it while uncontrolled", async () => {
    const wrapper = factory();
    wrapper.findComponent({ name: "SelectRoot" }).vm.$emit("update:open", true);
    await nextTick();
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
    expect(wrapper.attributes("open")).toBe("true");
  });

  it("re-emits update:modelValue in reka vocabulary", async () => {
    const wrapper = factory();
    wrapper
      .findComponent({ name: "SelectRoot" })
      .vm.$emit("update:modelValue", "banana");
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([["banana"]]);
    expect(wrapper.attributes("modelvalue")).toBe("banana");
  });

  it("stays pinned to the open prop while controlled", async () => {
    const wrapper = factory({ open: false });
    wrapper.findComponent({ name: "SelectRoot" }).vm.$emit("update:open", true);
    await nextTick();
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
    expect(wrapper.attributes("open")).toBe("false");
  });

  it("exposes writable model refs on ctx", async () => {
    const wrapper = factory();
    wrapper.vm.ctx.open.value = true;
    await nextTick();
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
    expect(wrapper.attributes("open")).toBe("true");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>options</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
