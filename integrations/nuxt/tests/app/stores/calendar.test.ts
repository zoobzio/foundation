// Gold standard: stores. Exercised through the shim's real useState semantics
// — the contract under test is the keyed shared container, config-driven
// defaults, and the one-time seed.
import { describe, expect, it } from "vitest";
import { accessCalendar } from "../../../app/stores/calendar";

describe("accessCalendar", () => {
  it("initializes the container from the config defaults", () => {
    const state = accessCalendar("c1", { views: ["week", "day"] });
    expect(state.view).toBe("week");
    expect(state.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(state.entries).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.initialized).toBe(false);
    expect(state.revision).toBe(0);
    expect(state.selected).toBeNull();
  });

  it("seeds the container from the initial slice", () => {
    const state = accessCalendar("c1", {}, { view: "day", date: "2026-03-04" });
    expect(state.view).toBe("day");
    expect(state.date).toBe("2026-03-04");
  });

  it("same id shares state across calls, seeded once", () => {
    const first = accessCalendar("c1", {}, { date: "2026-03-04" });
    first.revision = 3;
    const second = accessCalendar("c1", {}, { date: "2027-01-01" });
    expect(second).toBe(first);
    expect(second.revision).toBe(3);
    expect(second.date).toBe("2026-03-04");
  });

  it("different ids get independent state", () => {
    const a = accessCalendar("c1");
    const b = accessCalendar("c2");
    a.selected = "x";
    expect(b.selected).toBeNull();
  });
});
