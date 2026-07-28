import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createScopedStub } from "#test/stubs";
import Heading from "#foundation/components/common/date-picker/heading.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Heading, {
    props,
    slots,
    global: {
      stubs: {
        DatePickerHeading: createScopedStub("DatePickerHeading", { headingValue: "April 2026" }),
      },
    },
  });

describe("common/date-picker/Heading", () => {
  it("renders with f-date-picker-heading class", () => {
    expect(factory().classes()).toContain("f-date-picker-heading");
  });

  it("renders the reka heading value as the slot fallback", () => {
    expect(factory().text()).toContain("April 2026");
  });

  it("forwards the heading payload into the slot", () => {
    const wrapper = factory({}, {
      default: "<template #default=\"p\"><b>{{ p.headingValue }}</b></template>",
    });
    expect(wrapper.find("b").text()).toBe("April 2026");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel", () => {
    expect(factory({ aria: { hidden: true } }).attributes("aria-hidden")).toBe("true");
  });
});
