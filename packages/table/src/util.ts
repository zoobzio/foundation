import type { Field } from "@zoobzio/query";
import type { DataTableColumn } from "./types";

import { TABLE_DEFAULT_OPERATORS, TABLE_OPERATORS } from "./constants";

/**
 * The query fields of the filterable columns: one per column, with the
 * operators and default operator of its type and the values of an enum or
 * boolean column. A column's properties beyond the ones the table reads
 * (what a layer widens it with, such as an icon) are carried onto its
 * field, so the search draws the field as the column does.
 */
export const fields = <T>(
  columns: DataTableColumn<T>[],
): Record<string, Field> =>
  Object.fromEntries(
    columns.map((c) => {
      const {
        key,
        label,
        type,
        align: _a,
        sortable: _s,
        sortKey: _k,
        enumValues,
        filterable: _f,
        ...rest
      } = c;
      const operators = type ? TABLE_OPERATORS[type] : undefined;
      const defaultOperator = type ? TABLE_DEFAULT_OPERATORS[type] : undefined;
      const values = type === "boolean" ? ["true", "false"] : enumValues;
      return [
        String(key),
        {
          ...rest,
          label,
          ...(operators && { operators }),
          ...(defaultOperator && { defaultOperator }),
          ...(values && { values }),
        },
      ];
    }),
  );
