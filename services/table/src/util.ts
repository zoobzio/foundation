import type { Field, Values } from "@zoobzio/query";
import type { DataTableColumn } from "./types";
import { dateValues } from "@zoobzio/query";

/**
 * The query fields of the filterable columns: one per column, with the
 * operators, default operator, and values the column declares. The table
 * supplies no operators, and values for a `date` or `datetime` column
 * alone: the days the query's `dateValues` generates in `timeZone`, where
 * the column declares none of its own. A column that declares nothing
 * else is a bare field, free entry and no operator stage. A column's
 * properties beyond the ones the table and its views read (what a layer
 * widens it with, such as an icon) are carried onto its field, so the
 * search draws the field as the column does; its `link` is the view's and
 * stays off the field.
 */
export const fields = <T>(
  columns: DataTableColumn<T>[],
  timeZone: string,
): Record<string, Field> => {
  let dates: Values | undefined;
  return Object.fromEntries(
    columns.map((c) => {
      const {
        key,
        label,
        type,
        align: _a,
        sortable: _s,
        sortKey: _k,
        filterable: _f,
        operators,
        defaultOperator,
        values: declared,
        link: _l,
        ...rest
      } = c;
      const values =
        declared ??
        (type === "date" || type === "datetime"
          ? (dates ??= dateValues(timeZone))
          : undefined);
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
};
