import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createScopedStub } from "#test/stubs";
import Field from "#foundation/components/common/date-picker/field.vue";

const mockSegments = [
  { part: "day", value: "25" },
  { part: "literal", value: "/" },
];

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Field, {
    props,
    slots,
    global: {
      stubs: {
        DatePickerField: createScopedStub("DatePickerField", {
          segments: mockSegments,
          modelValue: undefined,
        }),
      },
    },
  });

describe("common/date-picker/Field", () => {
  it("renders with f-date-picker-field class", () => {
    expect(factory().classes()).toContain("f-date-picker-field");
  });

  it("forwards the segments payload into the slot", () => {
    const wrapper = factory({}, {
      default: "<template #default=\"p\"><i>{{ p.segments.length }}</i></template>",
    });
    expect(wrapper.find("i").text()).toBe("2");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the group role", () => {
    expect(factory({ aria: { label: "Date" } }).attributes("aria-label")).toBe("Date");
  });
});
