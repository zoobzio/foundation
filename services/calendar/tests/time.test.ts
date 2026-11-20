import { describe, expect, it } from "vitest";
import { daysOf, rangeOf, step } from "../src/time";

describe("daysOf", () => {
  it("shows the whole weeks a month touches", () => {
    const days = daysOf("month", "2026-03-15", "mo");
    expect(days[0]).toBe("2026-02-23");
    expect(days.at(-1)).toBe("2026-04-05");
    expect(days).toHaveLength(42);
  });

  it("starts the weeks on the configured day", () => {
    const days = daysOf("month", "2026-03-15", "su");
    expect(days[0]).toBe("2026-03-01");
    expect(days.at(-1)).toBe("2026-04-04");
    expect(days).toHaveLength(35);
  });

  it("shows the week a date falls in", () => {
    expect(daysOf("week", "2026-03-04", "mo")).toEqual([
      "2026-03-02",
      "2026-03-03",
      "2026-03-04",
      "2026-03-05",
      "2026-03-06",
      "2026-03-07",
      "2026-03-08",
    ]);
  });

  it("shows the day, and the agenda's run from the date", () => {
    expect(daysOf("day", "2026-03-04", "mo")).toEqual(["2026-03-04"]);
    const agenda = daysOf("agenda", "2026-03-04", "mo");
    expect(agenda[0]).toBe("2026-03-04");
    expect(agenda).toHaveLength(30);
  });
});

describe("rangeOf", () => {
  it("spans the days from midnight to midnight in the zone", () => {
    expect(rangeOf(["2026-03-28", "2026-03-29"], "Europe/Amsterdam")).toEqual({
      start: "2026-03-27T23:00:00Z",
      end: "2026-03-29T22:00:00Z",
    });
  });
});

describe("step", () => {
  it("moves a month, a week, a day, or the agenda's run", () => {
    expect(step("month", "2026-01-31", 1)).toBe("2026-02-28");
    expect(step("week", "2026-03-04", -1)).toBe("2026-02-25");
    expect(step("day", "2026-03-01", -1)).toBe("2026-02-28");
    expect(step("agenda", "2026-03-04", 1)).toBe("2026-04-03");
  });
});
