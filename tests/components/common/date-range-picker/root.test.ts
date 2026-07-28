import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { rekaStubs } from "#test/stubs";
import Root from "#foundation/components/common/date-range-picker/root.vue";

const mockDate = { toString: () => "2026-04-25" };
const mockRange = { start: mockDate, end: mockDate };

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Root, { props, slots, global: { stubs: rekaStubs("DateRangePickerRoot") } });

describe("common/date-range-picker/Root", () => {
  it("renders with f-date-range-picker-root class", () => {
    expect(factory().classes()).toContain("f-date-range-picker-root");
  });

  it("binds the controlled model down", () => {
    const wrapper = factory({ modelValue: mockRange });
    const root = wrapper.findComponent({ name: "DateRangePickerRoot" });
    expect(root.vm.$attrs.modelValue).toEqual(mockRange);
  });

  it("passes an explicit undefined through as a value (no fallback)", async () => {
    const wrapper = factory({ modelValue: undefined });
    wrapper
      .findComponent({ name: "DateRangePickerRoot" })
      .vm.$emit("update:modelValue", mockRange);
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([[mockRange]]);
    const root = wrapper.findComponent({ name: "DateRangePickerRoot" });
    expect(root.vm.$attrs.modelValue).toBeUndefined();
  });

  it("binds open=false by default", () => {
    expect(factory().attributes("open")).toBe("false");
  });

  it("re-emits update:open and tracks it while uncontrolled", async () => {
    const wrapper = factory();
    wrapper
      .findComponent({ name: "DateRangePickerRoot" })
      .vm.$emit("update:open", true);
    await nextTick();
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
    expect(wrapper.attributes("open")).toBe("true");
  });

  it("exposes writable model refs on ctx", async () => {
    const wrapper = factory();
    wrapper.vm.ctx.modelValue.value = mockRange;
    wrapper.vm.ctx.open.value = true;
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([[mockRange]]);
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
  });

  it("renders the aria channel for the group role", () => {
    expect(factory({ aria: { label: "Pick a range" } }).attributes("aria-label")).toBe("Pick a range");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>picker</b>" }).find("b").exists()).toBe(true);
  });
});
