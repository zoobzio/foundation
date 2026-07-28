import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import HeadCell from "#foundation/components/common/date-range-picker/head-cell.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(HeadCell, { props, slots, global: { stubs: rekaStubs("DateRangePickerHeadCell") } });

describe("common/date-range-picker/HeadCell", () => {
  it("renders with f-date-range-picker-head-cell class", () => {
    expect(factory().classes()).toContain("f-date-range-picker-head-cell");
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
    expect(factory({}, { default: "<b>Su</b>" }).find("b").exists()).toBe(true);
  });
});
