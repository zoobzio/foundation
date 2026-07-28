import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Content from "#foundation/components/common/date-range-picker/content.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Content, { props, slots, global: { stubs: rekaStubs("DateRangePickerContent") } });

describe("common/date-range-picker/Content", () => {
  it("renders with f-date-range-picker-content class", () => {
    expect(factory().classes()).toContain("f-date-range-picker-content");
  });

  it("forwards reka props through the rest spread", () => {
    expect(factory({ sideOffset: 8 }).attributes("sideoffset")).toBe("8");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the dialog role", () => {
    expect(factory({ aria: { label: "Calendar" } }).attributes("aria-label")).toBe("Calendar");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>calendar</b>" }).find("b").exists()).toBe(true);
  });
});
