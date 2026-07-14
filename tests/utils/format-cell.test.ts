import { describe, it, expect } from "vitest";
import { formatCell } from "#foundation/utils/format-cell";

describe("formatCell", () => {
  it("returns empty string for null", () => {
    expect(formatCell(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(formatCell(undefined)).toBe("");
  });

  it("formats date type", () => {
    expect(formatCell("2025-03-15T12:00:00", "date")).toContain("Mar 15, 2025");
  });

  it("formats datetime type", () => {
    const result = formatCell("2025-03-15T14:30:00", "datetime");
    expect(result).toContain("Mar 15, 2025");
  });

  it("formats currency type", () => {
    expect(formatCell(1234.5, "currency")).toBe("$1,234.50");
  });

  it("formats currency with zero cents", () => {
    expect(formatCell(100, "currency")).toBe("$100.00");
  });

  it("formats number type with commas", () => {
    expect(formatCell(9999, "number")).toBe("9,999");
  });

  it("formats large numbers", () => {
    expect(formatCell(1234567, "number")).toBe("1,234,567");
  });

  it("formats boolean true as Yes", () => {
    expect(formatCell(true, "boolean")).toBe("Yes");
  });

  it("formats boolean false as No", () => {
    expect(formatCell(false, "boolean")).toBe("No");
  });

  it("formats truthy value as Yes for boolean type", () => {
    expect(formatCell(1, "boolean")).toBe("Yes");
  });

  it("formats falsy value as No for boolean type", () => {
    expect(formatCell(0, "boolean")).toBe("No");
  });

  it("converts to string for text type", () => {
    expect(formatCell("hello", "text")).toBe("hello");
  });

  it("converts to string for unknown type", () => {
    expect(formatCell(42)).toBe("42");
  });

  it("converts to string for enum type", () => {
    expect(formatCell("Active", "enum")).toBe("Active");
  });
});
