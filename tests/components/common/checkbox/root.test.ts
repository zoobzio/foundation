import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { rekaStubs } from "#test/stubs";
import Root from "#foundation/components/common/checkbox/root.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Root, { props, slots, global: { stubs: rekaStubs("CheckboxRoot") } });

describe("common/checkbox/Root", () => {
  it("renders with f-checkbox-root class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-checkbox-root");
  });

  it("leaves modelValue unbound when absent (no boolean cast)", () => {
    const wrapper = factory();
    expect(wrapper.attributes("modelvalue")).toBeUndefined();
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ disabled: true, name: "agree", value: "yes" });
    expect(wrapper.attributes("disabled")).toBe("true");
    expect(wrapper.attributes("name")).toBe("agree");
    expect(wrapper.attributes("value")).toBe("yes");
  });

  it("binds controlled modelValue down", () => {
    const wrapper = factory({ modelValue: "indeterminate" });
    expect(wrapper.attributes("modelvalue")).toBe("indeterminate");
  });

  it("re-emits update:modelValue and tracks it while uncontrolled", async () => {
    const wrapper = factory();
    wrapper
      .findComponent({ name: "CheckboxRoot" })
      .vm.$emit("update:modelValue", true);
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
    expect(wrapper.attributes("modelvalue")).toBe("true");
  });

  it("stays pinned to the modelValue prop while controlled", async () => {
    const wrapper = factory({ modelValue: false });
    wrapper
      .findComponent({ name: "CheckboxRoot" })
      .vm.$emit("update:modelValue", true);
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
    expect(wrapper.attributes("modelvalue")).toBe("false");
  });

  it("exposes a writable model ref on ctx", async () => {
    const wrapper = factory();
    wrapper.vm.ctx.modelValue.value = true;
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
    expect(wrapper.attributes("modelvalue")).toBe("true");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the checkbox role", () => {
    const wrapper = factory({ aria: { checked: true } });
    expect(wrapper.attributes("aria-checked")).toBe("true");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>indicator</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
