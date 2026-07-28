import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Arrow from "#foundation/components/common/popover/arrow.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Arrow, { props, slots, global: { stubs: rekaStubs("PopoverArrow") } });

describe("common/popover/Arrow", () => {
  it("renders with f-popover-arrow class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-popover-arrow");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ width: 12, height: 6 });
    expect(wrapper.attributes("width")).toBe("12");
    expect(wrapper.attributes("height")).toBe("6");
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
});
