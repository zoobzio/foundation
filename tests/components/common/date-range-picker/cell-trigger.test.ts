import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createScopedStub } from "#test/stubs";
import CellTrigger from "#foundation/components/common/date-range-picker/cell-trigger.vue";

const mockDate = { toString: () => "2026-04-25" };

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(CellTrigger, {
    props: { day: mockDate, month: mockDate, ...props },
    slots,
    global: {
      stubs: {
        DateRangePickerCellTrigger: createScopedStub("DateRangePickerCellTrigger", { dayValue: "25" }),
      },
    },
  });

describe("common/date-range-picker/CellTrigger", () => {
  it("renders with f-date-range-picker-cell-trigger class", () => {
    expect(factory().classes()).toContain("f-date-range-picker-cell-trigger");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory();
    expect(wrapper.attributes("day")).toBe("2026-04-25");
    expect(wrapper.attributes("month")).toBe("2026-04-25");
  });

  it("renders the reka day value as the slot fallback", () => {
    expect(factory().text()).toContain("25");
  });

  it("forwards the day payload into the slot", () => {
    const wrapper = factory({}, {
      default: "<template #default=\"p\"><b>{{ p.dayValue }}</b></template>",
    });
    expect(wrapper.find("b").text()).toBe("25");
  });

  it("re-emits click from the primitive", async () => {
    const wrapper = factory();
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("renders the aria channel for the button role", () => {
    expect(factory({ aria: { label: "April 25" } }).attributes("aria-label")).toBe("April 25");
  });
});
