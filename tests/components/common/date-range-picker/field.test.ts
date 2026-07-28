import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createScopedStub } from "#test/stubs";
import Field from "#foundation/components/common/date-range-picker/field.vue";

const mockSegments = {
  start: [{ part: "day", value: "25" }],
  end: [{ part: "day", value: "26" }],
};

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Field, {
    props,
    slots,
    global: {
      stubs: {
        DateRangePickerField: createScopedStub("DateRangePickerField", {
          segments: mockSegments,
          modelValue: null,
        }),
      },
    },
  });

describe("common/date-range-picker/Field", () => {
  it("renders with f-date-range-picker-field class", () => {
    expect(factory().classes()).toContain("f-date-range-picker-field");
  });

  it("forwards the split segments payload into the slot", () => {
    const wrapper = factory({}, {
      default: "<template #default=\"p\"><i>{{ p.segments.start.length }}-{{ p.segments.end.length }}</i></template>",
    });
    expect(wrapper.find("i").text()).toBe("1-1");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the group role", () => {
    expect(factory({ aria: { label: "Range" } }).attributes("aria-label")).toBe("Range");
  });
});
