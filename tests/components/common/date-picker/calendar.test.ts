import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createScopedStub } from "#test/stubs";
import Calendar from "#foundation/components/common/date-picker/calendar.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Calendar, {
    props,
    slots,
    global: {
      stubs: {
        DatePickerCalendar: createScopedStub("DatePickerCalendar", {
          weekDays: ["Su", "Mo"],
          grid: [],
        }),
      },
    },
  });

describe("common/date-picker/Calendar", () => {
  it("renders with f-date-picker-calendar class", () => {
    expect(factory().classes()).toContain("f-date-picker-calendar");
  });

  it("forwards reka's render-scope payload into the slot", () => {
    const wrapper = factory({}, {
      default: "<template #default=\"p\"><i>{{ p.weekDays.join(',') }}</i></template>",
    });
    expect(wrapper.find("i").text()).toBe("Su,Mo");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the group role", () => {
    expect(factory({ aria: { label: "April" } }).attributes("aria-label")).toBe("April");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>grid</b>" }).find("b").exists()).toBe(true);
  });
});
