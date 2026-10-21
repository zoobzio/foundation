import type { Field } from "@zoobzio/query";
import type { DataTableColumn } from "./types";

import { TABLE_DEFAULT_OPERATORS, TABLE_OPERATORS } from "./constants";

/**
 * The query fields of the filterable columns: one per column, with the
 * operators and default operator of its type and the values of an enum or
 * boolean column.
 */
export const fields = <T>(
  columns: DataTableColumn<T>[],
): Record<string, Field> =>
  Object.fromEntries(
    columns.map((c) => {
      const operators = c.type ? TABLE_OPERATORS[c.type] : undefined;
      const defaultOperator = c.type
        ? TABLE_DEFAULT_OPERATORS[c.type]
        : undefined;
      const values = c.type === "boolean" ? ["true", "false"] : c.enumValues;
      return [
        String(c.key),
        {
          label: c.label,
          ...(operators && { operators }),
          ...(defaultOperator && { defaultOperator }),
          ...(values && { values }),
        },
      ];
    }),
  );
