import type { Field, Values } from "@zoobzio/query";
import type { RowData, TableColumn } from "./types";
import { dateValues } from "@zoobzio/query";

/**
 * Whether a column appears in the search: as its `meta.filterable` says,
 * or by default any column that reads a value, but an `action` or an
 * `image` one.
 */
export const filterable = <T extends RowData>(
  column: TableColumn<T>,
): boolean => {
  const { filterable, type } = column.columnDef.meta ?? {};
  return (
    filterable ??
    (column.accessorFn !== undefined && type !== "action" && type !== "image")
  );
};

/**
 * The query fields of the filterable columns: one per column, keyed by its
 * id, with the label, operators, default operator, and values its `meta`
 * declares. The table supplies no operators, and values for a `date` or
 * `datetime` column alone: the days the query's `dateValues` generates in
 * `timeZone`, where the column declares none of its own. A column that
 * declares nothing else is a bare field, free entry and no operator stage.
 * A property of the `meta` beyond the ones the table and its views read
 * (what a layer widens it with, such as an icon) is carried onto the
 * field, so the search draws the field as the column does.
 */
export const fields = <T extends RowData>(
  columns: TableColumn<T>[],
  timeZone: string,
): Record<string, Field> => {
  let dates: Values | undefined;
  return Object.fromEntries(
    columns.filter(filterable).map((column) => {
      const {
        label,
        type,
        align: _a,
        filterable: _f,
        operators,
        defaultOperator,
        values: declared,
        link: _l,
        ...rest
      } = column.columnDef.meta ?? {};
      const values =
        declared ??
        (type === "date" || type === "datetime"
          ? (dates ??= dateValues(timeZone))
          : undefined);
      return [
        column.id,
        {
          ...rest,
          label: label ?? column.id,
          ...(operators?.length && { operators }),
          ...(operators?.length && defaultOperator && { defaultOperator }),
          ...(values && { values }),
        },
      ];
    }),
  );
};
