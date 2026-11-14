// The expansion against the format's own semantics: the rule, the
// overrides, the time zones, and the range.
import { describe, expect, it } from "vitest";
import { expand } from "../src/recur";
import { event, march, task } from "./data";

const starts = (found: ReturnType<typeof expand>) =>
  found.map((hit) => hit.occurrence.start);

describe("an entry that does not recur", () => {
  it("is its own occurrence where it meets the range", () => {
    const found = expand(
      [event("a", "2026-03-02T09:00:00"), event("b", "2026-04-02T09:00:00")],
      march,
      "UTC",
    );
    expect(found).toHaveLength(1);
    expect(found[0]?.occurrence).toEqual({
      key: "a",
      uid: "a",
      entry: event("a", "2026-03-02T09:00:00"),
      start: "2026-03-02T09:00:00Z",
      end: "2026-03-02T10:00:00Z",
      allDay: false,
    });
    expect(found[0]?.source).toBe(0);
  });

  it("is in the range it reaches into, and not in the one it ends at", () => {
    const late = event("a", "2026-02-28T23:00:00", { duration: "PT2H" });
    const done = event("b", "2026-02-28T23:00:00", { duration: "PT1H" });
    expect(
      expand([late, done], march, "UTC").map((h) => h.occurrence.key),
    ).toEqual(["a"]);
  });

  it("reads its time in its own zone, and a floating one in the calendar's", () => {
    const found = expand(
      [
        event("a", "2026-03-02T09:00:00", { timeZone: "America/New_York" }),
        event("b", "2026-03-02T09:00:00"),
      ],
      march,
      "Europe/Amsterdam",
    );
    expect(starts(found)).toEqual([
      "2026-03-02T08:00:00Z",
      "2026-03-02T14:00:00Z",
    ]);
  });

  it("shows an all-day event without its time", () => {
    const found = expand(
      [
        event("a", "2026-03-02T00:00:00", {
          duration: "P2D",
          showWithoutTime: true,
        }),
      ],
      march,
      "UTC",
    );
    expect(found[0]?.occurrence.allDay).toBe(true);
    expect(found[0]?.occurrence.end).toBe("2026-03-04T00:00:00Z");
  });
});

describe("a task", () => {
  it("spans its start to its due time, or sits at the one it names", () => {
    const found = expand(
      [
        task("a", { start: "2026-03-02T09:00:00", due: "2026-03-04T17:00:00" }),
        task("b", { due: "2026-03-05T17:00:00" }),
        task("c"),
      ],
      march,
      "UTC",
    );
    expect(found.map((h) => [h.occurrence.start, h.occurrence.end])).toEqual([
      ["2026-03-02T09:00:00Z", "2026-03-04T17:00:00Z"],
      ["2026-03-05T17:00:00Z", "2026-03-05T17:00:00Z"],
    ]);
  });

  it("moves its due time with each occurrence", () => {
    const found = expand(
      [
        task("a", {
          start: "2026-03-02T09:00:00",
          due: "2026-03-03T17:00:00",
          recurrenceRule: { frequency: "weekly", count: 2 },
        }),
      ],
      march,
      "UTC",
    );
    expect(found.map((h) => h.occurrence.end)).toEqual([
      "2026-03-03T17:00:00Z",
      "2026-03-10T17:00:00Z",
    ]);
  });
});

describe("a rule", () => {
  it("gives the occurrences inside the range", () => {
    const found = expand(
      [
        event("a", "2026-02-02T09:00:00", {
          recurrenceRule: { frequency: "weekly" },
        }),
      ],
      march,
      "UTC",
    );
    expect(starts(found)).toEqual([
      "2026-03-02T09:00:00Z",
      "2026-03-09T09:00:00Z",
      "2026-03-16T09:00:00Z",
      "2026-03-23T09:00:00Z",
      "2026-03-30T09:00:00Z",
    ]);
    expect(found[0]?.occurrence.key).toBe("a#2026-03-02T09:00:00");
    expect(found[0]?.occurrence.recurrenceId).toBe("2026-03-02T09:00:00");
  });

  it("makes each occurrence a JSCalendar object of its own", () => {
    const base = event("a", "2026-03-02T09:00:00", {
      timeZone: "Europe/Amsterdam",
      title: "Standup",
      recurrenceRule: { frequency: "daily", count: 2 },
    });
    const found = expand([base], march, "UTC");
    expect(found[1]?.occurrence.entry).toEqual({
      "@type": "Event",
      uid: "a",
      updated: "2026-01-01T00:00:00Z",
      title: "Standup",
      timeZone: "Europe/Amsterdam",
      duration: "PT1H",
      start: "2026-03-03T09:00:00",
      recurrenceId: "2026-03-03T09:00:00",
      recurrenceIdTimeZone: "Europe/Amsterdam",
    });
  });

  it("keeps the wall-clock time across a clock change", () => {
    const found = expand(
      [
        event("a", "2026-03-27T09:00:00", {
          timeZone: "Europe/Amsterdam",
          recurrenceRule: { frequency: "daily", count: 4 },
        }),
      ],
      march,
      "UTC",
    );
    expect(starts(found)).toEqual([
      "2026-03-27T08:00:00Z",
      "2026-03-28T08:00:00Z",
      "2026-03-29T07:00:00Z",
      "2026-03-30T07:00:00Z",
    ]);
  });

  it("counts the start as the first occurrence, whether or not it matches", () => {
    // 2026-03-02 is a Monday; the rule names Wednesdays.
    const found = expand(
      [
        event("a", "2026-03-02T09:00:00", {
          recurrenceRule: {
            frequency: "weekly",
            byDay: [{ day: "we" }],
            count: 3,
          },
        }),
      ],
      march,
      "UTC",
    );
    expect(starts(found)).toEqual([
      "2026-03-02T09:00:00Z",
      "2026-03-04T09:00:00Z",
      "2026-03-11T09:00:00Z",
    ]);
  });

  it("ends on or before its until", () => {
    const found = expand(
      [
        event("a", "2026-03-02T09:00:00", {
          recurrenceRule: { frequency: "weekly", until: "2026-03-16T09:00:00" },
        }),
      ],
      march,
      "UTC",
    );
    expect(starts(found)).toHaveLength(3);
  });

  it("reads the nth weekday of a month, an interval, and a set position", () => {
    const found = expand(
      [
        event("last-friday", "2026-01-30T09:00:00", {
          recurrenceRule: {
            frequency: "monthly",
            byDay: [{ day: "fr", nthOfPeriod: -1 }],
          },
        }),
        event("every-other-day", "2026-03-01T12:00:00", {
          recurrenceRule: { frequency: "daily", interval: 2, count: 3 },
        }),
        event("last-weekday", "2026-01-30T15:00:00", {
          recurrenceRule: {
            frequency: "monthly",
            byDay: ["mo", "tu", "we", "th", "fr"].map((d) => ({
              day: d as "mo",
            })),
            bySetPosition: [-1],
          },
        }),
      ],
      march,
      "UTC",
    );
    expect(found.map((h) => [h.occurrence.uid, h.occurrence.start])).toEqual([
      ["every-other-day", "2026-03-01T12:00:00Z"],
      ["every-other-day", "2026-03-03T12:00:00Z"],
      ["every-other-day", "2026-03-05T12:00:00Z"],
      ["last-friday", "2026-03-27T09:00:00Z"],
      ["last-weekday", "2026-03-31T15:00:00Z"],
    ]);
  });

  it("gives an occurrence that began before the range and reaches into it", () => {
    const found = expand(
      [
        event("a", "2026-02-21T22:00:00", {
          duration: "PT4H",
          recurrenceRule: { frequency: "weekly" },
        }),
      ],
      march,
      "UTC",
    );
    expect(starts(found)[0]).toBe("2026-02-28T22:00:00Z");
  });
});

describe("overrides", () => {
  const base = (overrides: Record<string, Record<string, unknown>>) =>
    event("a", "2026-03-02T09:00:00", {
      title: "Standup",
      recurrenceRule: { frequency: "daily", count: 3 },
      recurrenceOverrides: overrides,
    });

  it("drop an excluded occurrence", () => {
    const found = expand(
      [base({ "2026-03-03T09:00:00": { excluded: true } })],
      march,
      "UTC",
    );
    expect(starts(found)).toEqual([
      "2026-03-02T09:00:00Z",
      "2026-03-04T09:00:00Z",
    ]);
  });

  it("change an occurrence, its start included, and keep its id", () => {
    const found = expand(
      [
        base({
          "2026-03-03T09:00:00": {
            title: "Moved",
            start: "2026-03-03T14:00:00",
            duration: "PT30M",
          },
        }),
      ],
      march,
      "UTC",
    );
    const moved = found.find(
      (h) => h.occurrence.recurrenceId === "2026-03-03T09:00:00",
    )?.occurrence;
    expect(moved?.start).toBe("2026-03-03T14:00:00Z");
    expect(moved?.end).toBe("2026-03-03T14:30:00Z");
    expect(moved?.entry.title).toBe("Moved");
    expect(moved?.entry.recurrenceId).toBe("2026-03-03T09:00:00");
  });

  it("add an occurrence the rule does not give", () => {
    const found = expand([base({ "2026-03-20T09:00:00": {} })], march, "UTC");
    expect(starts(found).at(-1)).toBe("2026-03-20T09:00:00Z");
    expect(found).toHaveLength(4);
  });

  it("recur an entry that has no rule", () => {
    const found = expand(
      [
        event("a", "2026-03-02T09:00:00", {
          recurrenceOverrides: { "2026-03-09T09:00": {} },
        }),
      ],
      march,
      "UTC",
    );
    expect(found.map((h) => h.occurrence.key)).toEqual([
      "a#2026-03-02T09:00:00",
      "a#2026-03-09T09:00:00",
    ]);
  });

  it("pass over a patch that may not stand", () => {
    const found = expand(
      [base({ "2026-03-03T09:00:00": { uid: "other", title: "Moved" } })],
      march,
      "UTC",
    );
    expect(found[1]?.occurrence.entry.uid).toBe("a");
    expect(found[1]?.occurrence.entry.title).toBe("Standup");
  });
});

describe("an occurrence served on its own", () => {
  it("stands for the one its base gives", () => {
    const found = expand(
      [
        event("a", "2026-03-02T09:00:00", {
          recurrenceRule: { frequency: "daily", count: 2 },
        }),
        event("a", "2026-03-03T11:00:00", {
          recurrenceId: "2026-03-03T09:00:00",
          title: "Served",
        }),
      ],
      march,
      "UTC",
    );
    expect(found).toHaveLength(2);
    expect(found[1]?.occurrence.entry.title).toBe("Served");
    expect(found[1]?.occurrence.start).toBe("2026-03-03T11:00:00Z");
    expect(found[1]?.source).toBe(1);
  });
});
