import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import GridHead from "#foundation/components/common/range-calendar/grid-head.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(GridHead, { props, slots, global: { stubs: rekaStubs("RangeCalendarGridHead") } });

describe("common/range-calendar/GridHead", () => {
  it("renders with f-range-calendar-grid-head class", () => {
    expect(factory().classes()).toContain("f-range-calendar-grid-head");
  });

  it("forwards reka props through the rest spread", () => {
    expect(factory({ asChild: true }).attributes("aschild")).toBe("true");
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

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>row</b>" }).find("b").exists()).toBe(true);
  });
});
