// The cell glue of the table and browser wrappers: the slot defaults that
// format a cell's value through the app's prosary service, by the column's
// type, as `text.ts` resolves its text. Each is a `cell:<type>` slot, so a
// consumer's `cell:<key>` slot still wins for one column, and a type the
// layer does not format falls to the vue component's own cell.
import type { VNode } from "vue";

import { useNuxtApp } from "#app";
import { h } from "vue";
import { textSlot } from "./text";

/** The units a file size climbs through, 1024 at a time. */
const UNITS = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"] as const;

/** A cell's value as the slot scope hands it, with the service's currency. */
type Cell = { value: unknown; currency: string };

/** A formatted value as a cell's content; an absent value as none. */
const node = (text: string): VNode[] => [h("span", { class: "f-span" }, text)];

/** Whether a value is a calendar day, `YYYY-MM-DD`, which formats in UTC. */
const isCalendarDay = (value: unknown): boolean =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

const date = ({ value }: Cell): VNode[] => {
  if (value == null) return node("");
  const { $prosary } = useNuxtApp();
  const at = new Date(String(value));
  return node(
    isCalendarDay(value)
      ? $prosary.date(at, { dateStyle: "medium", timeZone: "UTC" })
      : $prosary.date(at),
  );
};

const datetime = ({ value }: Cell): VNode[] => {
  if (value == null) return node("");
  const { $prosary } = useNuxtApp();
  const at = new Date(String(value));
  return node(`${$prosary.date(at)} ${$prosary.time(at)}`);
};

const number = ({ value }: Cell): VNode[] => {
  if (value == null) return node("");
  return node(useNuxtApp().$prosary.number(Number(value)));
};

const currency = ({ value, currency }: Cell): VNode[] => {
  if (value == null) return node("");
  return node(
    useNuxtApp().$prosary.number(Number(value), {
      style: "currency",
      currency,
    }),
  );
};

const filesize = ({ value }: Cell): VNode[] => {
  if (value == null) return node("");
  let size = Number(value);
  let unit = 0;
  while (size >= 1024 && unit < UNITS.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return node(
    useNuxtApp().$prosary.number(size, {
      style: "unit",
      unit: UNITS[unit],
      unitDisplay: "short",
      maximumFractionDigits: 1,
    }),
  );
};

const boolean = ({ value }: Cell): VNode[] => {
  if (value == null) return node("");
  return [
    h("span", { class: "f-span" }, textSlot(value ? "cell.yes" : "cell.no")),
  ];
};

/**
 * The `cell:<type>` slot defaults, over a reader of the service's currency
 * from the slot's scope: `table` for the table body, `browser` for the
 * browser's files.
 */
export const cellSlots = <S>(currencyOf: (scope: S) => string) => {
  const cell =
    (format: (cell: Cell) => VNode[]) =>
    (scope: S & { value: unknown }): VNode[] =>
      format({ value: scope.value, currency: currencyOf(scope) });
  return {
    "cell:date": cell(date),
    "cell:datetime": cell(datetime),
    "cell:number": cell(number),
    "cell:currency": cell(currency),
    "cell:filesize": cell(filesize),
    "cell:boolean": cell(boolean),
  };
};
