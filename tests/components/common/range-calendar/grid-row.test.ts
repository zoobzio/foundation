import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import GridRow from "#foundation/components/common/range-calendar/grid-row.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(GridRow, { props, slots, global: { stubs: rekaStubs("RangeCalendarGridRow") } });

describe("common/range-calendar/GridRow", () => {
  it("renders with f-range-calendar-grid-row class", () => {
    expect(factory().classes()).toContain("f-range-calendar-grid-row");
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

  it("renders the aria channel for the row role", () => {
    expect(factory({ aria: { hidden: true } }).attributes("aria-hidden")).toBe("true");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>cells</b>" }).find("b").exists()).toBe(true);
  });
});
