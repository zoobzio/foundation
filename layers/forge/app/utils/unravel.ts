import type { DataTableColumn, TableFilter } from "../types/data-table";

export interface UnravelResult<T> {
  inputValue: string;
  lockedField: DataTableColumn<T> | null;
  lockedOperator: string | null;
  lockedDate1: string | null;
  lockedSteps: AutocompleteItem[];
  /** Index to remove from filters (-1 = don't remove, consumer handles facet removal separately) */
  removeIndex: number;
  /** For enum unravel: the namespaced facet key to remove from selectedFacets */
  removeFacetKey: string | null;
}

export const formatDate = (d: Date) => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/**
 * Given the last filter in the list and the column definitions,
 * compute the autocomplete state that "unravels" the filter back
 * into the input — as if the user had been mid-way through typing it.
 */
export const unravelFilter = <T>(
  filter: TableFilter,
  filterIndex: number,
  columns: DataTableColumn<T>[],
): UnravelResult<T> | null => {
  // Enum — peel off the last value
  if (filter.value.type === "enum") {
    const col = columns.find((c) => String(c.key) === filter.field);
    if (!col) return null;
    const values = [...filter.value.value];
    const lastVal = values.pop()!;
    return {
      inputValue: `${col.label}=${lastVal.slice(0, -1)}`,
      lockedField: col,
      lockedOperator: null,
      lockedDate1: null,
      lockedSteps: [
        { label: col.label, value: String(col.key), icon: "filter" as IconAlias },
      ],
      removeIndex: -1,
      removeFacetKey: `${filter.field}:${lastVal}`,
    };
  }

  // Date — unravel into field + operator + partial date
  if (filter.value.type === "date") {
    const col = columns.find((c) => String(c.key) === filter.field);
    if (!col) return null;
    const op = filter.operator === "before" ? "<" : ">";
    const dateStr = formatDate(filter.value.value);
    return {
      inputValue: `${col.label}${op}${dateStr.slice(0, -1)}`,
      lockedField: col,
      lockedOperator: op,
      lockedDate1: null,
      lockedSteps: [
        { label: col.label, value: String(col.key), icon: "calendar" as IconAlias },
        {
          label: op === ">" ? "After" : "Before",
          value: op,
          hasChildren: true,
        },
      ],
      removeIndex: filterIndex,
      removeFacetKey: null,
    };
  }

  // Date range — unravel the second date
  if (filter.value.type === "date_range") {
    const col = columns.find((c) => String(c.key) === filter.field);
    if (!col) return null;
    const date1 = formatDate(filter.value.value[0]);
    const date2 = formatDate(filter.value.value[1]);
    return {
      inputValue: `${col.label}><${date1},${date2.slice(0, -1)}`,
      lockedField: col,
      lockedOperator: "><",
      lockedDate1: date1,
      lockedSteps: [
        { label: col.label, value: String(col.key), icon: "calendar" as IconAlias },
        { label: "Between", value: "><", hasChildren: true },
        { label: date1, value: date1, hasChildren: true },
      ],
      removeIndex: filterIndex,
      removeFacetKey: null,
    };
  }

  // Query — unravel (remove closing quote)
  if (filter.field === "__query" && filter.value.type === "text") {
    return {
      inputValue: `"${filter.value.value}`,
      lockedField: null,
      lockedOperator: null,
      lockedDate1: null,
      lockedSteps: [],
      removeIndex: filterIndex,
      removeFacetKey: null,
    };
  }

  // Keywords — unravel (remove closing paren)
  if (filter.field === "__keywords" && filter.value.type === "text") {
    return {
      inputValue: `(${filter.value.value}`,
      lockedField: null,
      lockedOperator: null,
      lockedDate1: null,
      lockedSteps: [],
      removeIndex: filterIndex,
      removeFacetKey: null,
    };
  }

  // Fallback — just remove the filter, no unravel
  return null;
};
