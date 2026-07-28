import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Indicator from "#foundation/components/common/radio-group/indicator.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Indicator, {
    props,
    slots,
    global: { stubs: rekaStubs("RadioGroupIndicator") },
  });

describe("common/radio-group/Indicator", () => {
  it("renders with f-radio-group-indicator class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-radio-group-indicator");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the generic role", () => {
    const wrapper = factory({ aria: { hidden: true } });
    expect(wrapper.attributes("aria-hidden")).toBe("true");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>dot</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
