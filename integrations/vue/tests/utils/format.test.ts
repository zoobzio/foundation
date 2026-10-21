import { describe, expect, it } from "vitest";
import type { ColumnType } from "@zoobzio/table";
import { cell, date } from "../../src/utils/format";

describe("date", () => {
  it("formats in UTC as YYYY-MM-DD", () => {
    expect(date(new Date(Date.UTC(2025, 0, 5)))).toBe("2025-01-05");
  });
});

describe("cell", () => {
  it("renders null and undefined as empty", () => {
    expect(cell(null, "text", "en-US", "USD")).toBe("");
    expect(cell(undefined, undefined, "en-US", "USD")).toBe("");
  });

  it("formats by type", () => {
    const en = (v: unknown, t?: ColumnType) => cell(v, t, "en-US", "USD");
    expect(en(1234.5, "number")).toBe("1,234.5");
    expect(en(12, "currency")).toBe("$12.00");
    expect(en(true, "boolean")).toBe("Yes");
    expect(en(0, "boolean")).toBe("No");
    expect(en(2048, "filesize")).toBe("2 kB");
    expect(en("2025-01-15T00:00:00Z", "date")).toMatch(/2025/);
    expect(en("x", undefined)).toBe("x");
  });

  it("formats by the given locale and currency", () => {
    expect(cell(12, "currency", "de-DE", "EUR")).toMatch(/^12,00\s€$/);
    expect(cell(1234.5, "number", "de-DE", "EUR")).toBe("1.234,5");
  });
});
