import { describe, expect, it } from "vitest";
import { dateValues } from "../src/dates";
import { QUERY_DATE_VALUES_LIMIT } from "../src/constants";

describe("dateValues", () => {
  // 2026-11-04 23:30 UTC: still the 4th in UTC, already the 5th in Tokyo,
  // and the 4th in New York.
  const now = () => new Date("2026-11-04T23:30:00Z");

  /** The first page of a term's days. */
  const first = (values: ReturnType<typeof dateValues>, term: string) =>
    values(term).values;

  /** Every day of a term, page by page, to `pages` at most. */
  const all = (
    values: ReturnType<typeof dateValues>,
    term: string,
    pages = 100,
  ) => {
    const days: string[] = [];
    let cursor: unknown;
    for (let i = 0; i < pages; i++) {
      const page = values(term, { cursor });
      days.push(...page.values);
      if (page.next === undefined) break;
      cursor = page.next;
    }
    return days;
  };

  it("lists the last days, today first, for an empty term", () => {
    const page = dateValues("UTC", now)("");
    expect(page.values).toHaveLength(QUERY_DATE_VALUES_LIMIT);
    expect(page.values[0]).toBe("2026-11-04");
    expect(page.values[1]).toBe("2026-11-03");
    expect(page.values.at(-1)).toBe("2026-10-05");
    expect(page.next).toBe("2026-10-05");
  });

  it("reads today in the time zone", () => {
    expect(first(dateValues("Asia/Tokyo", now), "")[0]).toBe("2026-11-05");
    expect(first(dateValues("America/New_York", now), "")[0]).toBe(
      "2026-11-04",
    );
  });

  it("reads the clock on each first page", () => {
    let at = new Date("2026-11-04T00:00:00Z");
    const values = dateValues("UTC", () => at);
    expect(first(values, "")[0]).toBe("2026-11-04");
    at = new Date("2026-11-05T00:00:00Z");
    expect(first(values, "")[0]).toBe("2026-11-05");
  });

  it("runs on from the last day of the page before, whatever the clock", () => {
    let at = new Date("2026-11-04T00:00:00Z");
    const values = dateValues("UTC", () => at);
    const page = values("");
    at = new Date("2026-11-06T00:00:00Z");
    const next = values("", { cursor: page.next });
    expect(next.values).toHaveLength(QUERY_DATE_VALUES_LIMIT);
    expect(next.values[0]).toBe("2026-10-04");
    expect(next.values.at(-1)).toBe("2026-09-04");
    expect(next.next).toBe("2026-09-04");
  });

  it("runs back through the turn of a year and a leap day", () => {
    const values = dateValues("UTC", () => new Date("2025-01-02T12:00:00Z"));
    const days = all(values, "", 12);
    expect(days.slice(0, 3)).toEqual([
      "2025-01-02",
      "2025-01-01",
      "2024-12-31",
    ]);
    expect(days).toContain("2024-02-29");
    expect(days[days.indexOf("2024-02-29") + 1]).toBe("2024-02-28");
    expect(new Set(days).size).toBe(days.length);
  });

  it("begins again on a cursor that is not a day of its own", () => {
    const values = dateValues("UTC", now);
    const page = values("");
    for (const cursor of [31, "x", "2026-02-30", "2026-13-01", "2027-01-01"]) {
      expect(values("", { cursor })).toEqual(page);
    }
  });

  it("runs a partial year back from the latest day it can start", () => {
    const values = dateValues("UTC", () => new Date("2026-01-10T12:00:00Z"));
    const recent = first(values, "");
    expect(recent).toContain("2025-12-31");
    expect(first(values, "2")).toEqual(recent);
    expect(first(values, "202")).toEqual(recent);
    expect(first(values, "2025")).not.toEqual(recent);
    expect(first(values, "19")[0]).toBe("1999-12-31");
    expect(first(values, "201")[0]).toBe("2019-12-31");
    expect(first(values, "3")).toEqual([]);
    expect(values("3").next).toBeUndefined();
    expect(first(values, "203")).toEqual([]);
  });

  it("ends a partial year at the first day of the first year it names", () => {
    const values = dateValues("UTC", () => new Date("2020-01-20T12:00:00Z"));
    const days = all(values, "202");
    expect(days).toHaveLength(20);
    expect(days.at(-1)).toBe("2020-01-01");
    const page = values("202", { cursor: "2020-01-01" });
    expect(page).toEqual({ values: [] });
  });

  it("lists the days of a year newest first, a page at a time", () => {
    const values = dateValues("UTC", now);
    const page = values("2025");
    expect(page.values).toHaveLength(QUERY_DATE_VALUES_LIMIT);
    expect(page.values[0]).toBe("2025-12-31");
    expect(page.values.at(-1)).toBe("2025-12-01");
    expect(page.next).toBe("2025-12-01");
    expect(values("2025-")).toEqual(page);
    const days = all(values, "2025");
    expect(days).toHaveLength(365);
    expect(days.at(-1)).toBe("2025-01-01");
    expect(all(values, "2024")).toHaveLength(366);
    expect(new Set(days).size).toBe(days.length);
  });

  it("narrows a year to a partial month, newest first, a page at a time", () => {
    const values = dateValues("UTC", now);
    const page = values("2025-0");
    expect(page.values).toHaveLength(QUERY_DATE_VALUES_LIMIT);
    expect(page.values[0]).toBe("2025-09-30");
    expect(page.values.at(-1)).toBe("2025-08-31");
    expect(first(values, "2025-1")[0]).toBe("2025-12-31");
    expect(all(values, "2025-0").at(-1)).toBe("2025-01-01");
    expect(all(values, "2025-1")).toHaveLength(92);
  });

  it("reads a year below 1000 as the year it is", () => {
    const values = dateValues("UTC", now);
    expect(first(values, "0099")[0]).toBe("0099-12-31");
    expect(first(values, "0")[0]).toBe("0999-12-31");
    expect(all(values, "0004-02")).toHaveLength(29);
  });

  it("lists the days of a month newest first, in one page", () => {
    const values = dateValues("UTC", now);
    expect(values("2025-03").next).toBeUndefined();
    const march = first(values, "2025-03");
    expect(march).toHaveLength(31);
    expect(march[0]).toBe("2025-03-31");
    expect(march.at(-1)).toBe("2025-03-01");
    expect(first(values, "2025-03-")).toEqual(march);
    expect(first(values, "2025-04")).toHaveLength(30);
    expect(first(values, "2025-02")).toHaveLength(28);
    expect(first(values, "2024-02")).toHaveLength(29);
    expect(first(values, "2100-02")).toHaveLength(28);
    expect(first(values, "2000-02")).toHaveLength(29);
  });

  it("narrows a month to a partial day", () => {
    const values = dateValues("UTC", now);
    expect(first(values, "2025-03-1")).toEqual([
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
    expect(first(values, "2025-02-3")).toEqual([]);
    expect(first(values, "2025-03-3")).toEqual(["2025-03-31", "2025-03-30"]);
  });

  it("lists a complete day alone, and a day that does not exist not at all", () => {
    const values = dateValues("UTC", now);
    expect(first(values, "2025-03-15")).toEqual(["2025-03-15"]);
    expect(first(values, "2024-02-29")).toEqual(["2024-02-29"]);
    expect(first(values, "2025-02-29")).toEqual([]);
    expect(first(values, "2025-02-30")).toEqual([]);
    expect(first(values, "2025-03-32")).toEqual([]);
    expect(first(values, "2025-03-00")).toEqual([]);
    expect(first(values, "2025-13")).toEqual([]);
    expect(first(values, "2025-00")).toEqual([]);
  });

  it("reaches into the future", () => {
    const values = dateValues("UTC", now);
    expect(first(values, "2030")[0]).toBe("2030-12-31");
    expect(first(values, "2027-01")).toHaveLength(31);
    expect(first(values, "2026-11")[0]).toBe("2026-11-30");
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
    expect(terms.filter((term) => first(values, term).length)).toEqual([]);
  });

  it("rejects a time zone it cannot read when built", () => {
    expect(() => dateValues("Not/AZone", now)).toThrow(RangeError);
  });
});
