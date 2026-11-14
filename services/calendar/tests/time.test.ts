import { describe, expect, it } from "vitest";
import {
  day,
  dayOf,
  daysOf,
  local,
  normal,
  rangeOf,
  shift,
  stamp,
  step,
  utc,
  zoned,
} from "../src/time";

describe("zoned", () => {
  it("reads a local date-time in its zone", () => {
    expect(utc(zoned("2026-03-02T09:00:00", "Europe/Amsterdam"))).toBe(
      "2026-03-02T08:00:00Z",
    );
  });

  // The two examples of the format's LocalDateTime section.
  it("reads a time in an overlap with the offset before the transition", () => {
    expect(utc(zoned("2020-11-01T01:30:00", "America/Los_Angeles"))).toBe(
      "2020-11-01T08:30:00Z",
    );
  });

  it("reads a time in a gap with the offset before the transition", () => {
    expect(utc(zoned("2020-10-04T02:30:00", "Australia/Melbourne"))).toBe(
      "2020-10-03T16:30:00Z",
    );
  });

  it("adds a day as a day and an hour as an hour across a clock change", () => {
    const start = zoned("2026-03-28T12:00:00", "Europe/Amsterdam");
    expect(local(start.add("P1D"))).toBe("2026-03-29T12:00:00");
    expect(local(start.add("PT24H"))).toBe("2026-03-29T13:00:00");
  });
});

describe("spellings", () => {
  it("writes a local date-time to the second", () => {
    expect(normal("2026-03-02T09:00")).toBe("2026-03-02T09:00:00");
  });

  it("writes an instant to the second", () => {
    expect(stamp(new Date("2026-03-02T09:00:00.789Z"))).toBe(
      "2026-03-02T09:00:00Z",
    );
  });

  it("moves a date-time by the distance between two others", () => {
    expect(
      shift(
        "2026-03-03T17:00:00",
        "2026-03-02T09:00:00",
        "2026-03-09T10:00:00",
      ),
    ).toBe("2026-03-10T18:00:00");
  });

  it("rejects a day that is not one", () => {
    expect(day("2026-03-02")).toBe("2026-03-02");
    expect(() => day("2026-02-30")).toThrow(RangeError);
  });

  it("reads the day of an instant in a zone", () => {
    const now = new Date("2026-03-02T23:30:00Z");
    expect(dayOf(now, "UTC")).toBe("2026-03-02");
    expect(dayOf(now, "Asia/Tokyo")).toBe("2026-03-03");
  });
});

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
