import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createScopedStub } from "#test/stubs";
import Root from "#foundation/components/common/range-calendar/root.vue";

const mockDate = { toString: () => "2026-04-25" };
const mockRange = { start: mockDate, end: mockDate };
const otherRange = { start: mockDate, end: undefined };

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Root, {
    props,
    slots,
    global: {
      stubs: {
        RangeCalendarRoot: createScopedStub("RangeCalendarRoot", {
          weekDays: ["Su", "Mo"],
          grid: [],
        }),
      },
    },
  });

describe("common/range-calendar/Root", () => {
  it("renders with f-range-calendar-root class", () => {
    expect(factory().classes()).toContain("f-range-calendar-root");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ numberOfMonths: 2, fixedWeeks: true });
    expect(wrapper.attributes("numberofmonths")).toBe("2");
    expect(wrapper.attributes("fixedweeks")).toBe("true");
  });

  it("forwards reka's render-scope payload into the slot", () => {
    const wrapper = factory({}, {
      default: "<template #default=\"p\"><i>{{ p.weekDays.join(',') }}</i></template>",
    });
    expect(wrapper.find("i").text()).toBe("Su,Mo");
  });

  it("binds controlled modelValue down", () => {
    const wrapper = factory({ modelValue: mockRange });
    const root = wrapper.findComponent({ name: "RangeCalendarRoot" });
    expect(root.vm.$attrs.modelValue).toEqual(mockRange);
  });

  it("passes an explicit undefined through as a value (no fallback)", async () => {
    const wrapper = factory({ modelValue: undefined });
    wrapper
      .findComponent({ name: "RangeCalendarRoot" })
      .vm.$emit("update:modelValue", mockRange);
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([[mockRange]]);
    const root = wrapper.findComponent({ name: "RangeCalendarRoot" });
    expect(root.vm.$attrs.modelValue).toBeUndefined();
  });

  it("stays pinned to the modelValue prop while provided", async () => {
    const wrapper = factory({ modelValue: mockRange });
    wrapper
      .findComponent({ name: "RangeCalendarRoot" })
      .vm.$emit("update:modelValue", otherRange);
    await nextTick();
    const root = wrapper.findComponent({ name: "RangeCalendarRoot" });
    expect(root.vm.$attrs.modelValue).toEqual(mockRange);
  });

  it("tracks child updates while the prop is absent", async () => {
    const wrapper = factory();
    wrapper
      .findComponent({ name: "RangeCalendarRoot" })
      .vm.$emit("update:modelValue", mockRange);
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([[mockRange]]);
    const root = wrapper.findComponent({ name: "RangeCalendarRoot" });
    expect(root.vm.$attrs.modelValue).toEqual(mockRange);
  });

  it("exposes a writable model ref on ctx", async () => {
    const wrapper = factory();
    wrapper.vm.ctx.modelValue.value = mockRange;
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([[mockRange]]);
  });

  it("renders the aria channel for the group role", () => {
    expect(factory({ aria: { label: "Pick a date" } }).attributes("aria-label")).toBe("Pick a date");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>days</b>" }).find("b").exists()).toBe(true);
  });
});
