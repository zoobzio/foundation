import type { Lookup, Page } from "./types";

import { QUERY_DATE_VALUES_LIMIT } from "./constants";

const pad = (n: number) => String(n).padStart(2, "0");

type Day = [y: number, m: number, d: number];

const day = (y: number, m: number, d: number) =>
  `${String(y).padStart(4, "0")}-${pad(m)}-${pad(d)}`;

const isLeap = (y: number) => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** The length of a month, by the calendar alone; none outside 1–12. */
const monthLength = (y: number, m: number): number =>
  m === 2 && isLeap(y) ? 29 : (MONTH_LENGTHS[m - 1] ?? 0);

/** The days of a month, newest first; none for a month outside 1–12. */
const daysOfMonth = (y: number, m: number): string[] => {
  const count = monthLength(y, m);
  return Array.from({ length: count }, (_, i) => day(y, m, count - i));
};

/** The days of a year, newest first. */
const daysOfYear = (y: number): string[] =>
  Array.from({ length: 12 }, (_, i) => daysOfMonth(y, 12 - i)).flat();

/**
 * The day before the given one. Calendar arithmetic on the day itself: no
 * clock and no zone, so the zone that named the day never shifts it, and a
 * year below 100 is the year it reads as.
 */
const dayBefore = ([y, m, d]: Day): Day => {
  if (d > 1) return [y, m, d - 1];
  if (m > 1) return [y, m - 1, monthLength(y, m - 1)];
  return [y - 1, 12, 31];
};

/**
 * The day a cursor names: the last day of the page before, as this
 * provider gave it. Anything else, a day that does not exist included, is
 * no cursor.
 */
const cursorDay = (cursor: unknown): Day | undefined => {
  if (typeof cursor !== "string") return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cursor)) return undefined;
  const [y = 0, m = 0, d = 0] = cursor.split("-").map(Number);
  return d >= 1 && d <= monthLength(y, m) ? [y, m, d] : undefined;
};

/**
 * One page of the days that run back from `from` while their year is
 * `floor` or later, newest first. `next` is the last day given, where a
 * day still follows it.
 */
const daysBack = (from: Day, floor: number): Page => {
  const values: string[] = [];
  let at = from;
  while (values.length < QUERY_DATE_VALUES_LIMIT && at[0] >= floor) {
    values.push(day(...at));
    at = dayBefore(at);
  }
  return at[0] >= floor && values.length
    ? { values, next: values.at(-1) }
    : { values };
};

/**
 * One page of a list of days, newest first: the days after the cursor's.
 * `next` is the last day given, where the list runs on.
 */
const pageOf = (days: string[], after: Day | undefined): Page => {
  const last = after && day(...after);
  const rest = last ? days.filter((d) => d < last) : days;
  const values = rest.slice(0, QUERY_DATE_VALUES_LIMIT);
  return rest.length > values.length
    ? { values, next: values.at(-1) }
    : { values };
};

/**
 * A values provider for a field that filters on a date: an unbounded,
 * term-driven list of days, `YYYY-MM-DD`, so a visitor always has an
 * option to pick as long as the term is date syntax. Each option is a
 * whole day, as choosing one commits the filter: the typed prefix selects
 * a range of days rather than drilling through years and months.
 *
 * The days come a page at a time, `QUERY_DATE_VALUES_LIMIT` to the page,
 * newest first; a page names the next by its last day, so a call for more
 * picks up from that day whatever the clock has done since. An empty term
 * runs back from today, as the day reads in `timeZone`, with no end. A
 * partial year, `2` or `202`, runs back from the latest day it can start:
 * today, or the last day of the latest year it names when that year is
 * past, `19` from `1999-12-31`; one that names only years to come lists
 * nothing. A full year, `2025` or `2025-`, lists its days, and a partial
 * month, `2025-0`, the days of the months that match. A month, `2025-03`,
 * lists its days; a partial day, `2025-03-1`, the days of the month that
 * match; a complete day stands alone. A day that does not exist,
 * `2025-02-30`, or a term that is not date syntax lists nothing. A full
 * year or a month may lie in the future: only an empty term and a partial
 * year look back from today. `now` is read on each first page, so today
 * moves with the clock. A time zone `Intl` cannot read throws here, not
 * on the first term.
 */
export const dateValues = (
  timeZone: string,
  now: () => Date = () => new Date(),
): ((term: string, lookup?: Pick<Lookup, "cursor">) => Page) => {
  const format = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const today = (): Day => {
    const parts = format.formatToParts(now());
    const read = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((p) => p.type === type)?.value);
    return [read("year"), read("month"), read("day")];
  };
  return (term, lookup) => {
    const after = cursorDay(lookup?.cursor);
    if (/^\d{0,3}$/.test(term)) {
      // The years the prefix names: `19` is 1900 through 1999.
      const span = 10 ** (4 - term.length);
      const floor = Number(term) * span;
      const from = today();
      if (from[0] < floor) return { values: [] };
      const start: Day =
        from[0] < floor + span ? from : [floor + span - 1, 12, 31];
      // A cursor past the start is not this term's: begin again.
      return after && day(...after) <= day(...start)
        ? daysBack(dayBefore(after), floor)
        : daysBack(start, floor);
    }
    if (/^\d{4}(-\d?)?$/.test(term)) {
      const days = daysOfYear(Number(term.slice(0, 4)));
      return pageOf(
        days.filter((d) => d.startsWith(term)),
        after,
      );
    }
    if (/^\d{4}-\d{2}(-\d{0,2})?$/.test(term)) {
      const days = daysOfMonth(
        Number(term.slice(0, 4)),
        Number(term.slice(5, 7)),
      );
      return pageOf(
        days.filter((d) => d.startsWith(term)),
        after,
      );
    }
    return { values: [] };
  };
};
