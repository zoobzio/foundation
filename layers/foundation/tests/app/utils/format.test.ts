// The cell formatter's own logic: each ColumnType's default rendering.
// Real Intl output asserted (en-US), no snapshot indirection.
import { describe, expect, it } from "vitest";
import { cell } from "../../../app/utils/format";

describe("cell", () => {
  it("renders nullish values as empty text", () => {
    expect(cell(null, "text")).toBe("");
    expect(cell(undefined, "number")).toBe("");
  });

  it("renders numbers and currency through Intl", () => {
    expect(cell(1234.5, "number")).toBe("1,234.5");
    expect(cell(1234.5, "currency")).toBe("$1,234.50");
  });

  it("renders booleans as Yes/No", () => {
    expect(cell(true, "boolean")).toBe("Yes");
    expect(cell(false, "boolean")).toBe("No");
  });

  it("scales filesize through binary units with one decimal", () => {
    expect(cell(512, "filesize")).toBe("512 byte");
    expect(cell(2048, "filesize")).toBe("2 kB");
    expect(cell(1536, "filesize")).toBe("1.5 kB");
    expect(cell(1048576, "filesize")).toBe("1 MB");
    expect(cell(182450009, "filesize")).toBe("174 MB");
    expect(cell(5_368_709_120, "filesize")).toBe("5 GB");
    expect(cell(2 ** 40 * 3, "filesize")).toBe("3 TB");
  });

  it("caps filesize at terabytes", () => {
    expect(cell(2 ** 50, "filesize")).toBe("1,024 TB");
  });

  it("falls back to string rendering for untyped values", () => {
    expect(cell("plain", undefined)).toBe("plain");
    expect(cell(42, "enum")).toBe("42");
  });
});
