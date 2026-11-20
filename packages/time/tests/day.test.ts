import { describe, expect, it } from "vitest";
import { Temporal } from "temporal-polyfill";
import { day, dayOf, weekStart } from "../src/day";

describe("day", () => {
  it("rejects a day that is not one", () => {
    expect(day("2026-03-02")).toBe("2026-03-02");
    expect(() => day("2026-02-30")).toThrow(RangeError);
  });

  it("reads the day of an instant in a zone", () => {
    const now = new Date("2026-03-02T23:30:00Z");
    expect(dayOf(now, "UTC")).toBe("2026-03-02");
    expect(dayOf(now, "Asia/Tokyo")).toBe("2026-03-03");
  });

  it("finds the first day of a week from the day weeks start on", () => {
    const wednesday = Temporal.PlainDate.from("2026-03-04");
    expect(weekStart(wednesday, "mo").toString()).toBe("2026-03-02");
    expect(weekStart(wednesday, "su").toString()).toBe("2026-03-01");
    expect(weekStart(wednesday, "we").toString()).toBe("2026-03-04");
  });
});
