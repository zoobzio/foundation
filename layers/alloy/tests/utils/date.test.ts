import { describe, it, expect } from "vitest";
import { CalendarDate } from "@internationalized/date";
import { DateUtils } from "../../app/utils/date";
const { serialize, deserialize, format } = DateUtils;

describe("serialize", () => {
  it("converts DateValue to UTC Date", () => {
    const dv = new CalendarDate(2026, 4, 25);
    const result = serialize(dv);
    expect(result).toBeInstanceOf(Date);
    expect(result.getUTCFullYear()).toBe(2026);
    expect(result.getUTCMonth()).toBe(3); // 0-indexed
    expect(result.getUTCDate()).toBe(25);
  });
});

describe("deserialize", () => {
  it("converts Date to CalendarDate", () => {
    const d = new Date(Date.UTC(2026, 3, 25)); // April 25
    const result = deserialize(d);
    expect(result.year).toBe(2026);
    expect(result.month).toBe(4);
    expect(result.day).toBe(25);
  });
});

describe("format", () => {
  it("formats DateValue to YYYY-MM-DD", () => {
    const dv = new CalendarDate(2026, 4, 25);
    expect(format(dv)).toBe("2026-04-25");
  });

  it("pads single-digit month and day", () => {
    const dv = new CalendarDate(2026, 1, 5);
    expect(format(dv)).toBe("2026-01-05");
  });
});
