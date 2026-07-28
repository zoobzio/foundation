import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Cell from "#foundation/components/common/calendar/cell.vue";

const mockDate = { toString: () => "2026-04-25" };

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Cell, {
    props: { date: mockDate, ...props },
    slots,
    global: { stubs: rekaStubs("CalendarCell") },
  });

describe("common/calendar/Cell", () => {
  it("renders with f-calendar-cell class", () => {
    expect(factory().classes()).toContain("f-calendar-cell");
  });

  it("forwards reka props through the rest spread", () => {
    expect(factory().attributes("date")).toBe("2026-04-25");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the cell role", () => {
    expect(factory({ aria: { hidden: true } }).attributes("aria-hidden")).toBe("true");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>25</b>" }).find("b").exists()).toBe(true);
  });
});
