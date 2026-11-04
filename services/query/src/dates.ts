import { QUERY_DATE_VALUES_LIMIT } from "./constants";

const pad = (n: number) => String(n).padStart(2, "0");

const day = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

const isLeap = (y: number) => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** The days of a month, newest first; none for a month outside 1–12. */
const daysOfMonth = (y: number, m: number): string[] => {
  const length = MONTH_LENGTHS[m - 1];
  if (length === undefined) return [];
  const count = m === 2 && isLeap(y) ? 29 : length;
  return Array.from({ length: count }, (_, i) => day(y, m, count - i));
};

/** The days of a year, newest first. */
const daysOfYear = (y: number): string[] =>
  Array.from({ length: 12 }, (_, i) => daysOfMonth(y, 12 - i)).flat();

/**
 * The last `count` days ending on the given one, newest first. Day
 * arithmetic runs in UTC on the calendar day itself, so the zone that
 * named the day never shifts it.
 */
const recentDays = (y: number, m: number, d: number, count: number) => {
  const end = Date.UTC(y, m - 1, d);
  return Array.from({ length: count }, (_, i) => {
    const t = new Date(end - i * 86_400_000);
    return day(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
  });
};

/**
 * A values provider for a field that filters on a date: an unbounded,
 * term-driven list of days, `YYYY-MM-DD`, so a visitor always has an
 * option to pick as long as the term is date syntax. Each option is a
 * whole day, as choosing one commits the filter: the typed prefix selects
 * a range of days rather than drilling through years and months. An empty
 * term lists the last `QUERY_DATE_VALUES_LIMIT` days, today first, as the
 * day reads in `timeZone`; a partial year, `2` or `202`, narrows those. A
 * full year, `2025` or `2025-`, lists its days newest first, capped to the
 * limit; a month, `2025-03`, lists its days; a partial day, `2025-03-1`,
 * the days of the month that match; a complete day stands alone. A day
 * that does not exist, `2025-02-30`, or a term that is not date syntax
 * lists nothing. Years and months may lie in the future: only the empty
 * term looks back from today. `now` is read on each call, so today moves
 * with the clock. A time zone `Intl` cannot read throws here, not on the
 * first term.
 */
export const dateValues = (
  timeZone: string,
  now: () => Date = () => new Date(),
): ((term: string) => readonly string[]) => {
  const format = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const today = (): [number, number, number] => {
    const parts = format.formatToParts(now());
    const read = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((p) => p.type === type)?.value);
    return [read("year"), read("month"), read("day")];
  };
  return (term) => {
    let days: string[];
    if (/^\d{0,3}$/.test(term)) {
      days = recentDays(...today(), QUERY_DATE_VALUES_LIMIT);
    } else if (/^\d{4}(-\d?)?$/.test(term)) {
      days = daysOfYear(Number(term.slice(0, 4)));
    } else if (/^\d{4}-\d{2}(-\d{0,2})?$/.test(term)) {
      days = daysOfMonth(Number(term.slice(0, 4)), Number(term.slice(5, 7)));
    } else {
      return [];
    }
    return days
      .filter((d) => d.startsWith(term))
      .slice(0, QUERY_DATE_VALUES_LIMIT);
  };
};
