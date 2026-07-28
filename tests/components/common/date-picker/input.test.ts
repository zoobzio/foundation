import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Input from "#foundation/components/common/date-picker/input.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Input, {
    props: { part: "day", ...props },
    slots,
    global: { stubs: rekaStubs("DatePickerInput") },
  });

describe("common/date-picker/Input", () => {
  it("renders with f-date-picker-input class", () => {
    expect(factory().classes()).toContain("f-date-picker-input");
  });

  it("forwards reka props through the rest spread", () => {
    expect(factory().attributes("part")).toBe("day");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the spinbutton role", () => {
    expect(factory({ aria: { label: "Day" } }).attributes("aria-label")).toBe("Day");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>25</b>" }).find("b").exists()).toBe(true);
  });
});
