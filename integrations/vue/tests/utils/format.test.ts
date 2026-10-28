import { describe, expect, it } from "vitest";
import type { ColumnType } from "@zoobzio/table";
import { cell, date } from "../../src/utils/format";

describe("date", () => {
  it("formats in UTC as YYYY-MM-DD", () => {
    expect(date(new Date(Date.UTC(2025, 0, 5)))).toBe("2025-01-05");
  });
});

describe("cell", () => {
  const en = (v: unknown, t?: ColumnType, zone = "UTC") =>
    cell(v, t, "en-US", "USD", zone);

  it("renders null and undefined as empty", () => {
    expect(en(null, "text")).toBe("");
    expect(en(undefined, undefined)).toBe("");
  });

  it("formats by type", () => {
    expect(en(1234.5, "number")).toBe("1,234.5");
    expect(en(12, "currency")).toBe("$12.00");
    expect(en(true, "boolean")).toBe("Yes");
    expect(en(0, "boolean")).toBe("No");
    expect(en(2048, "filesize")).toBe("2 kB");
    expect(en("2025-01-15T00:00:00Z", "date")).toBe("Jan 15, 2025");
    expect(en("x", undefined)).toBe("x");
  });

  it("formats by the given locale and currency", () => {
    expect(cell(12, "currency", "de-DE", "EUR", "UTC")).toMatch(/^12,00\s€$/);
    expect(cell(1234.5, "number", "de-DE", "EUR", "UTC")).toBe("1.234,5");
  });

  it("formats dates and datetimes in the given time zone", () => {
    const instant = "2026-10-17T18:00:00.000Z";
    expect(en(instant, "datetime", "UTC")).toMatch(/^Oct 17, 2026, 6:00\sPM$/);
    expect(en(instant, "datetime", "America/Los_Angeles")).toMatch(
      /^Oct 17, 2026, 11:00\sAM$/,
    );
    expect(en("2026-10-17T03:00:00Z", "date", "America/Los_Angeles")).toBe(
      "Oct 16, 2026",
    );
  });

  it("keeps a calendar day on its day in every time zone", () => {
    expect(en("2026-10-17", "date", "America/Los_Angeles")).toBe(
      "Oct 17, 2026",
    );
    expect(en("2026-10-17", "date", "Pacific/Auckland")).toBe("Oct 17, 2026");
  });
});
