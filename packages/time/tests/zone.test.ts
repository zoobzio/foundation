import { describe, expect, it } from "vitest";
import { local, normal, shift, stamp, utc, zoned } from "../src/zone";

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
});
