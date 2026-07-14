import { describe, it, expect } from "vitest";
import { unravelFilter, formatDate } from "#foundation/utils/unravel";
import type { DataTableColumn, TableFilter } from "#foundation/types/data/table";

type Row = { id: number; status: string; created: string };

const columns: DataTableColumn<Row>[] = [
  { key: "status", label: "Status", type: "enum", enumValues: ["Active", "Inactive"] },
  { key: "created", label: "Created", type: "date" },
];

describe("formatDate", () => {
  it("formats a UTC date as YYYY-MM-DD", () => {
    expect(formatDate(new Date("2025-03-15T00:00:00Z"))).toBe("2025-03-15");
  });

  it("pads single-digit month and day", () => {
    expect(formatDate(new Date("2025-01-05T00:00:00Z"))).toBe("2025-01-05");
  });
});

describe("unravelFilter", () => {
  describe("enum", () => {
    it("unravels an enum filter into locked field + partial input", () => {
      const filter: TableFilter = {
        field: "status",
        operator: "is",
        value: { type: "enum", value: ["Active"] },
      };
      const result = unravelFilter(filter, 0, columns);
      expect(result).not.toBeNull();
      if (!result) return;
      expect(result.lockedField).toBe(columns[0]);
      expect(result.lockedOperator).toBeNull();
      expect(result.inputValue).toBe("Status=Activ");
      expect(result.lockedSteps).toHaveLength(1);
      expect(result.lockedSteps[0].icon).toBe("filter");
      expect(result.removeIndex).toBe(-1);
      expect(result.removeFacetKey).toBe("status:Active");
    });

    it("returns null when column not found", () => {
      const filter: TableFilter = {
        field: "unknown",
        operator: "is",
        value: { type: "enum", value: ["x"] },
      };
      expect(unravelFilter(filter, 0, columns)).toBeNull();
    });
  });

  describe("date", () => {
    it("unravels a before-date filter", () => {
      const filter: TableFilter = {
        field: "created",
        operator: "before",
        value: { type: "date", value: new Date("2025-06-15T00:00:00Z") },
      };
      const result = unravelFilter(filter, 2, columns);
      expect(result).not.toBeNull();
      if (!result) return;
      expect(result.lockedField).toBe(columns[1]);
      expect(result.lockedOperator).toBe("<");
      expect(result.inputValue).toBe("Created<2025-06-1");
      expect(result.lockedSteps).toHaveLength(2);
      expect(result.lockedSteps[1].label).toBe("Before");
      expect(result.removeIndex).toBe(2);
    });

    it("unravels an after-date filter", () => {
      const filter: TableFilter = {
        field: "created",
        operator: "after",
        value: { type: "date", value: new Date("2025-01-01T00:00:00Z") },
      };
      const result = unravelFilter(filter, 0, columns);
      if (!result) return;
      expect(result.lockedOperator).toBe(">");
      expect(result.lockedSteps[1].label).toBe("After");
    });
  });

  describe("date_range", () => {
    it("unravels a date range filter with both dates", () => {
      const filter: TableFilter = {
        field: "created",
        operator: "between",
        value: {
          type: "date_range",
          value: [
            new Date("2025-01-01T00:00:00Z"),
            new Date("2025-06-30T00:00:00Z"),
          ],
        },
      };
      const result = unravelFilter(filter, 1, columns);
      expect(result).not.toBeNull();
      if (!result) return;
      expect(result.lockedOperator).toBe("><");
      expect(result.lockedDate1).toBe("2025-01-01");
      expect(result.inputValue).toBe("Created><2025-01-01,2025-06-3");
      expect(result.lockedSteps).toHaveLength(3);
      expect(result.removeIndex).toBe(1);
    });
  });

  describe("query", () => {
    it("unravels a query filter by removing closing quote", () => {
      const filter: TableFilter = {
        field: "__query",
        operator: "semantic",
        value: { type: "text", value: "hello world" },
      };
      const result = unravelFilter(filter, 0, columns);
      if (!result) return;
      expect(result.inputValue).toBe('"hello world');
      expect(result.lockedField).toBeNull();
      expect(result.lockedSteps).toHaveLength(0);
      expect(result.removeIndex).toBe(0);
    });
  });

  describe("keywords", () => {
    it("unravels a keywords filter by removing closing paren", () => {
      const filter: TableFilter = {
        field: "__keywords",
        operator: "match",
        value: { type: "text", value: "+foo -bar" },
      };
      const result = unravelFilter(filter, 3, columns);
      if (!result) return;
      expect(result.inputValue).toBe("(+foo -bar");
      expect(result.removeIndex).toBe(3);
    });
  });

  describe("fallback", () => {
    it("returns null for unrecognized filter types", () => {
      const filter: TableFilter = {
        field: "something",
        operator: "eq",
        value: { type: "number", value: 42 },
      };
      expect(unravelFilter(filter, 0, columns)).toBeNull();
    });
  });
});
