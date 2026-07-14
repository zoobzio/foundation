import { describe, it, expect } from "vitest";
import { parseShorthand } from "#foundation/utils/parse-shorthand";
import type { DataTableColumn } from "#foundation/types/data/table";

type Row = { id: number; status: string; name: string };

const columns: DataTableColumn<Row>[] = [
  { key: "status", label: "Status", type: "enum", enumValues: ["Active", "Inactive", "Pending"] },
  { key: "name", label: "Name", type: "text" },
];

describe("parseShorthand", () => {
  describe("semantic search", () => {
    it('parses quoted string as semantic search', () => {
      const result = parseShorthand('"hello world"', columns);
      expect(result).toEqual({
        filter: {
          field: "__query",
          operator: "semantic",
          value: { type: "text", value: "hello world" },
        },
      });
    });

    it("returns null for unclosed quote", () => {
      expect(parseShorthand('"hello', columns)).toBeNull();
    });

    it("returns null for empty quotes", () => {
      expect(parseShorthand('""', columns)).toBeNull();
    });
  });

  describe("enum filter", () => {
    it("parses field=value by label", () => {
      const result = parseShorthand("Status=Active", columns);
      expect(result).toEqual({
        filter: {
          field: "status",
          operator: "is",
          value: { type: "enum", value: ["Active"] },
        },
      });
    });

    it("parses field=value by key (case-insensitive)", () => {
      const result = parseShorthand("status=active", columns);
      expect(result?.filter.value).toEqual({ type: "enum", value: ["Active"] });
    });

    it("parses multi-value field=a,b", () => {
      const result = parseShorthand("Status=Active,Pending", columns);
      expect(result?.filter.value).toEqual({ type: "enum", value: ["Active", "Pending"] });
    });

    it("returns null for non-enum column", () => {
      expect(parseShorthand("Name=test", columns)).toBeNull();
    });

    it("returns null for invalid enum value", () => {
      expect(parseShorthand("Status=Unknown", columns)).toBeNull();
    });

    it("returns null for unknown field", () => {
      expect(parseShorthand("Foo=bar", columns)).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("returns null for empty input", () => {
      expect(parseShorthand("", columns)).toBeNull();
    });

    it("returns null for whitespace", () => {
      expect(parseShorthand("   ", columns)).toBeNull();
    });

    it("returns null for unrecognized format", () => {
      expect(parseShorthand("just some text", columns)).toBeNull();
    });
  });
});
