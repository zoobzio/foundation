import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { rekaStubs } from "#test/stubs";
import Root from "#foundation/components/common/date-picker/root.vue";

const mockDate = { toString: () => "2026-04-25" };

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Root, { props, slots, global: { stubs: rekaStubs("DatePickerRoot") } });

describe("common/date-picker/Root", () => {
  it("renders with f-date-picker-root class", () => {
    expect(factory().classes()).toContain("f-date-picker-root");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ granularity: "day", disabled: true });
    expect(wrapper.attributes("granularity")).toBe("day");
    expect(wrapper.attributes("disabled")).toBe("true");
  });

  it("binds controlled modelValue down", () => {
    const wrapper = factory({ modelValue: mockDate });
    expect(wrapper.attributes("modelvalue")).toBe("2026-04-25");
  });

  it("passes an explicit undefined through as a value (no fallback)", async () => {
    const wrapper = factory({ modelValue: undefined });
    wrapper
      .findComponent({ name: "DatePickerRoot" })
      .vm.$emit("update:modelValue", mockDate);
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([[mockDate]]);
    expect(wrapper.attributes("modelvalue")).toBeUndefined();
  });

  it("stays pinned to the modelValue prop while provided", async () => {
    const wrapper = factory({ modelValue: mockDate });
    wrapper
      .findComponent({ name: "DatePickerRoot" })
      .vm.$emit("update:modelValue", { toString: () => "2026-05-01" });
    await nextTick();
    expect(wrapper.attributes("modelvalue")).toBe("2026-04-25");
  });

  it("binds open=false by default", () => {
    expect(factory().attributes("open")).toBe("false");
  });

  it("seeds the open fallback from defaultOpen", () => {
    expect(factory({ defaultOpen: true }).attributes("open")).toBe("true");
  });

  it("re-emits update:open and tracks it while uncontrolled", async () => {
    const wrapper = factory();
    wrapper.findComponent({ name: "DatePickerRoot" }).vm.$emit("update:open", true);
    await nextTick();
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
    expect(wrapper.attributes("open")).toBe("true");
  });

  it("exposes writable model refs on ctx", async () => {
    const wrapper = factory();
    wrapper.vm.ctx.open.value = true;
    wrapper.vm.ctx.modelValue.value = mockDate;
    await nextTick();
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
    expect(wrapper.emitted("update:modelValue")).toEqual([[mockDate]]);
  });

  it("renders the aria channel for the group role", () => {
    expect(factory({ aria: { label: "Pick a date" } }).attributes("aria-label")).toBe("Pick a date");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>picker</b>" }).find("b").exists()).toBe(true);
  });
});
