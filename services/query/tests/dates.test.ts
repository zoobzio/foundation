import { describe, expect, it } from "vitest";
import { dateValues } from "../src/dates";
import { QUERY_DATE_VALUES_LIMIT } from "../src/constants";

describe("dateValues", () => {
  // 2026-11-04 23:30 UTC: still the 4th in UTC, already the 5th in Tokyo,
  // and the 4th in New York.
  const now = () => new Date("2026-11-04T23:30:00Z");

  it("lists the last days, today first, for an empty term", () => {
    const days = dateValues("UTC", now)("");
    expect(days).toHaveLength(QUERY_DATE_VALUES_LIMIT);
    expect(days[0]).toBe("2026-11-04");
    expect(days[1]).toBe("2026-11-03");
    expect(days.at(-1)).toBe("2026-10-05");
  });

  it("reads today in the time zone", () => {
    expect(dateValues("Asia/Tokyo", now)("")[0]).toBe("2026-11-05");
    expect(dateValues("America/New_York", now)("")[0]).toBe("2026-11-04");
  });

  it("reads the clock on each call", () => {
    let at = new Date("2026-11-04T00:00:00Z");
    const values = dateValues("UTC", () => at);
    expect(values("")[0]).toBe("2026-11-04");
    at = new Date("2026-11-05T00:00:00Z");
    expect(values("")[0]).toBe("2026-11-05");
  });

  it("narrows the recent days to a partial year", () => {
    const values = dateValues("UTC", () => new Date("2026-01-10T12:00:00Z"));
    const all = values("");
    expect(all).toContain("2025-12-31");
    expect(values("2")).toEqual(all);
    expect(values("202")).toEqual(all);
    expect(values("2025")).not.toEqual(values(""));
    const atTurn = dateValues("UTC", () => new Date("2000-01-10T12:00:00Z"));
    expect(atTurn("1")).toEqual(atTurn("").filter((d) => d.startsWith("1")));
    expect(atTurn("1")[0]).toBe("1999-12-31");
    expect(atTurn("3")).toEqual([]);
  });

  it("lists the days of a year newest first, capped", () => {
    const values = dateValues("UTC", now);
    const days = values("2025");
    expect(days).toHaveLength(QUERY_DATE_VALUES_LIMIT);
    expect(days[0]).toBe("2025-12-31");
    expect(days.at(-1)).toBe("2025-12-01");
    expect(values("2025-")).toEqual(days);
  });

  it("narrows a year to a partial month, newest first, capped", () => {
    const values = dateValues("UTC", now);
    const days = values("2025-0");
    expect(days).toHaveLength(QUERY_DATE_VALUES_LIMIT);
    expect(days[0]).toBe("2025-09-30");
    expect(days.at(-1)).toBe("2025-08-31");
    expect(values("2025-1")[0]).toBe("2025-12-31");
  });

  it("lists the days of a month newest first", () => {
    const values = dateValues("UTC", now);
    const march = values("2025-03");
    expect(march).toHaveLength(31);
    expect(march[0]).toBe("2025-03-31");
    expect(march.at(-1)).toBe("2025-03-01");
    expect(values("2025-03-")).toEqual(march);
    expect(values("2025-04")).toHaveLength(30);
    expect(values("2025-02")).toHaveLength(28);
    expect(values("2024-02")).toHaveLength(29);
    expect(values("2100-02")).toHaveLength(28);
    expect(values("2000-02")).toHaveLength(29);
  });

  it("narrows a month to a partial day", () => {
    const values = dateValues("UTC", now);
    expect(values("2025-03-1")).toEqual([
      "2025-03-19",
      "2025-03-18",
      "2025-03-17",
      "2025-03-16",
      "2025-03-15",
      "2025-03-14",
      "2025-03-13",
      "2025-03-12",
      "2025-03-11",
      "2025-03-10",
    ]);
    expect(values("2025-02-3")).toEqual([]);
    expect(values("2025-03-3")).toEqual(["2025-03-31", "2025-03-30"]);
  });

  it("lists a complete day alone, and a day that does not exist not at all", () => {
    const values = dateValues("UTC", now);
    expect(values("2025-03-15")).toEqual(["2025-03-15"]);
    expect(values("2024-02-29")).toEqual(["2024-02-29"]);
    expect(values("2025-02-29")).toEqual([]);
    expect(values("2025-02-30")).toEqual([]);
    expect(values("2025-03-32")).toEqual([]);
    expect(values("2025-03-00")).toEqual([]);
    expect(values("2025-13")).toEqual([]);
    expect(values("2025-00")).toEqual([]);
  });

  it("reaches into the future", () => {
    const values = dateValues("UTC", now);
    expect(values("2030")[0]).toBe("2030-12-31");
    expect(values("2027-01")).toHaveLength(31);
    expect(values("2026-11")[0]).toBe("2026-11-30");
  });

  it("lists nothing for a term that is not date syntax", () => {
    const values = dateValues("UTC", now);
    const terms = [
      "x",
      "2025-3",
      "2025-3-1",
      "2025/03",
      "20250",
      "2025-03-150",
      "2025--",
      " 2025",
      "March",
      "-",
    ];
    expect(terms.filter((term) => values(term).length)).toEqual([]);
  });

  it("rejects a time zone it cannot read when built", () => {
    expect(() => dateValues("Not/AZone", now)).toThrow(RangeError);
  });
});
