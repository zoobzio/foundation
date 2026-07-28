import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Grid from "#foundation/components/common/date-range-picker/grid.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Grid, { props, slots, global: { stubs: rekaStubs("DateRangePickerGrid") } });

describe("common/date-range-picker/Grid", () => {
  it("renders with f-date-range-picker-grid class", () => {
    expect(factory().classes()).toContain("f-date-range-picker-grid");
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

  it("renders the aria channel for the grid role", () => {
    expect(factory({ aria: { label: "April" } }).attributes("aria-label")).toBe("April");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>rows</b>" }).find("b").exists()).toBe(true);
  });
});
