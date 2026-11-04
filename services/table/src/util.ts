import type { Field } from "@zoobzio/query";
import type { DataTableColumn } from "./types";

/**
 * The query fields of the filterable columns: one per column, with the
 * operators, default operator, and values the column declares. The table
 * supplies none: a column that declares nothing is a bare field, free
 * entry and no operator stage. A column's properties beyond the ones the
 * table reads (what a layer widens it with, such as an icon) are carried
 * onto its field, so the search draws the field as the column does.
 */
export const fields = <T>(
  columns: DataTableColumn<T>[],
): Record<string, Field> =>
  Object.fromEntries(
    columns.map((c) => {
      const {
        key,
        label,
        type: _t,
        align: _a,
        sortable: _s,
        sortKey: _k,
        filterable: _f,
        operators,
        defaultOperator,
        values,
        ...rest
      } = c;
      return [
        String(key),
        {
          ...rest,
          label,
          ...(operators?.length && { operators }),
          ...(operators?.length && defaultOperator && { defaultOperator }),
          ...(values && { values }),
        },
      ];
    }),
  );
