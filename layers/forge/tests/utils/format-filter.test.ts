import { describe, it, expect } from "vitest";
import { formatFilter } from "../../app/utils/format-filter";
import type { DataTableColumn, TableFilter } from "../../app/types/data-table";

type Row = { id: number; status: string; created: string; amount: number; active: boolean };

const columns: DataTableColumn<Row>[] = [
  { key: "status", label: "Status", type: "enum" },
  { key: "created", label: "Created", type: "date" },
  { key: "amount", label: "Amount", type: "number" },
  { key: "active", label: "Active", type: "boolean" },
];

describe("formatFilter", () => {
  it("formats query filter", () => {
    const filter: TableFilter = {
      field: "__query",
      operator: "semantic",
      value: { type: "text", value: "hello world" },
    };
    expect(formatFilter(filter, columns)).toBe('"hello world"');
  });

  it("formats keywords filter", () => {
    const filter: TableFilter = {
      field: "__keywords",
      operator: "match",
      value: { type: "text", value: "+foo -bar" },
    };
    expect(formatFilter(filter, columns)).toBe("(+foo -bar)");
  });

  it("formats text filter", () => {
    const filter: TableFilter = {
      field: "status",
      operator: "eq",
      value: { type: "text", value: "hello" },
    };
    expect(formatFilter(filter, columns)).toBe("Status=hello");
  });

  it("formats number eq filter", () => {
    const filter: TableFilter = {
      field: "amount",
      operator: "eq",
      value: { type: "number", value: 42 },
    };
    expect(formatFilter(filter, columns)).toBe("Amount=42");
  });

  it("formats number gt filter", () => {
    const filter: TableFilter = {
      field: "amount",
      operator: "gt",
      value: { type: "number", value: 100 },
    };
    expect(formatFilter(filter, columns)).toBe("Amount>100");
  });

  it("formats number lt filter", () => {
    const filter: TableFilter = {
      field: "amount",
      operator: "lt",
      value: { type: "number", value: 50 },
    };
    expect(formatFilter(filter, columns)).toBe("Amount<50");
  });

  it("formats number_range filter", () => {
    const filter: TableFilter = {
      field: "amount",
      operator: "between",
      value: { type: "number_range", value: [10, 99] },
    };
    expect(formatFilter(filter, columns)).toBe("Amount><10,99");
  });

  it("formats date before filter", () => {
    const filter: TableFilter = {
      field: "created",
      operator: "before",
      value: { type: "date", value: new Date("2025-06-15T00:00:00Z") },
    };
    expect(formatFilter(filter, columns)).toBe("Created<2025-06-15");
  });

  it("formats date after filter", () => {
    const filter: TableFilter = {
      field: "created",
      operator: "after",
      value: { type: "date", value: new Date("2025-01-01T00:00:00Z") },
    };
    expect(formatFilter(filter, columns)).toBe("Created>2025-01-01");
  });

  it("formats date_range filter", () => {
    const filter: TableFilter = {
      field: "created",
      operator: "between",
      value: {
        type: "date_range",
        value: [new Date("2025-01-01T00:00:00Z"), new Date("2025-06-30T00:00:00Z")],
      },
    };
    expect(formatFilter(filter, columns)).toBe("Created><2025-01-01,2025-06-30");
  });

  it("formats enum filter", () => {
    const filter: TableFilter = {
      field: "status",
      operator: "is",
      value: { type: "enum", value: ["Active", "Pending"] },
    };
    expect(formatFilter(filter, columns)).toBe("Status=Active,Pending");
  });

  it("formats boolean filter", () => {
    const filter: TableFilter = {
      field: "active",
      operator: "eq",
      value: { type: "boolean", value: true },
    };
    expect(formatFilter(filter, columns)).toBe("Active=true");
  });

  it("uses field name as fallback when column not found", () => {
    const filter: TableFilter = {
      field: "unknown",
      operator: "eq",
      value: { type: "text", value: "test" },
    };
    expect(formatFilter(filter, columns)).toBe("unknown=test");
  });
});
