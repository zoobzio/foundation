import type { DataTableColumn, TableFilter } from "../types/data-table";

export interface ShorthandResult {
  filter: TableFilter;
}

export const parseShorthand = <T>(
  input: string,
  columns: DataTableColumn<T>[],
): ShorthandResult | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Semantic search: "some query"
  if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length > 2) {
    return {
      filter: {
        field: "__query",
        operator: "semantic",
        value: { type: "text", value: trimmed.slice(1, -1) },
      },
    };
  }

  // Facet: field=value or field=value1,value2
  const eqMatch = trimmed.match(/^(\w+)=(.+)$/);
  if (eqMatch) {
    const [, fieldInput, valueStr] = eqMatch;
    if (!fieldInput || !valueStr) return null;

    const col = columns.find(
      (c) =>
        String(c.key).toLowerCase() === fieldInput.toLowerCase() ||
        c.label.toLowerCase() === fieldInput.toLowerCase(),
    );
    if (!col || col.type !== "enum") return null;

    const values = valueStr.split(",").map((v) => v.trim()).filter(Boolean);
    if (!values.length) return null;

    // Validate all values exist in enumValues if defined
    if (col.enumValues) {
      const valid = values.every((v) =>
        col.enumValues!.some((ev) => ev.toLowerCase() === v.toLowerCase()),
      );
      if (!valid) return null;
    }

    // Normalize values to match enumValues casing
    const normalized = col.enumValues
      ? values.map((v) =>
          col.enumValues!.find((ev) => ev.toLowerCase() === v.toLowerCase()) ?? v,
        )
      : values;

    return {
      filter: {
        field: String(col.key),
        operator: "is",
        value: { type: "enum", value: normalized },
      },
    };
  }

  return null;
};
