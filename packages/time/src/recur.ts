import type { Found, Range } from "./types";
import type {
  Entry,
  LocalDateTime,
  RecurrenceRule,
  TimeZoneId,
} from "./jscalendar";

import { RRuleTemporal } from "rrule-temporal";
import { Temporal } from "temporal-polyfill";
import {
  TIME_DEFAULT_SCALE,
  TIME_FREQUENCIES,
  TIME_NO_DURATION,
  TIME_SKIPS,
} from "./constants";
import { overrides, patch } from "./patch";
import { local, normal, shift, utc, zoned } from "./zone";

type Span = { start: Temporal.ZonedDateTime; end: Temporal.ZonedDateTime };

/** Whether an entry recurs: it has a start to recur from, and a rule or overrides. */
export const recurs = (entry: Entry): boolean =>
  entry.recurrenceId === undefined &&
  entry.start !== undefined &&
  (entry.recurrenceRule !== undefined ||
    Object.keys(entry.recurrenceOverrides ?? {}).length > 0);

/** The key of an occurrence: the `uid`, joined with the recurrence id. */
export const keyOf = (uid: string, recurrenceId?: LocalDateTime): string =>
  recurrenceId === undefined ? uid : `${uid}#${recurrenceId}`;

/**
 * The span an entry takes, in its own zone or, floating, in the
 * given one: an event from its start for its duration, a task from its
 * start to its due time, or at the one of the two it names. A task that
 * names neither takes none.
 */
const spanOf = (entry: Entry, zone: TimeZoneId): Span | null => {
  const at = entry.timeZone ?? zone;
  if (entry["@type"] === "Event") {
    const start = zoned(entry.start, at);
    return { start, end: start.add(entry.duration ?? TIME_NO_DURATION) };
  }
  const anchor = entry.start ?? entry.due;
  if (anchor === undefined) return null;
  const start = zoned(anchor, at);
  const end = zoned(entry.due ?? anchor, at);
  return {
    start,
    end: Temporal.ZonedDateTime.compare(end, start) < 0 ? start : end,
  };
};

/**
 * A JSCalendar rule as the rule the expansion runs: each property is the
 * RRULE part of its name. The start is always an occurrence.
 */
export const ruleOf = (
  rule: RecurrenceRule,
  start: Temporal.ZonedDateTime,
): RRuleTemporal<Temporal.ZonedDateTime> => {
  const zone = start.timeZoneId;
  // SKIP is read with RSCALE alone, so a rule that skips names its scale.
  const scale = rule.rscale ?? (rule.skip ? TIME_DEFAULT_SCALE : undefined);
  return new RRuleTemporal<Temporal.ZonedDateTime>({
    temporal: Temporal,
    dtstart: start,
    tzid: zone,
    includeDtstart: true,
    freq: TIME_FREQUENCIES[rule.frequency],
    interval: rule.interval,
    rscale: scale?.toUpperCase(),
    skip: rule.skip && TIME_SKIPS[rule.skip],
    wkst: rule.firstDayOfWeek?.toUpperCase(),
    byDay: rule.byDay?.map(
      (entry) => `${entry.nthOfPeriod ?? ""}${entry.day.toUpperCase()}`,
    ),
    byMonthDay: rule.byMonthDay,
    byMonth: rule.byMonth?.map((month) =>
      /^\d+$/.test(month) ? Number(month) : month,
    ),
    byYearDay: rule.byYearDay,
    byWeekNo: rule.byWeekNo,
    byHour: rule.byHour,
    byMinute: rule.byMinute,
    bySecond: rule.bySecond,
    bySetPos: rule.bySetPosition,
    count: rule.count,
    until: rule.until === undefined ? undefined : zoned(rule.until, zone),
  });
};

/**
 * One occurrence of a recurring entry as a JSCalendar object: the entry
 * moved to the recurrence id, its rule and overrides left out, its
 * override applied. An override that may not stand, or that does not
 * apply, is passed over, and the occurrence is the rule's.
 */
export const instanceOf = (
  entry: Entry,
  recurrenceId: LocalDateTime,
): Entry => {
  const { recurrenceRule: _rule, recurrenceOverrides, ...rest } = entry;
  const moved: Entry = {
    ...rest,
    start: recurrenceId,
    recurrenceId,
    ...(entry.timeZone !== undefined && {
      recurrenceIdTimeZone: entry.timeZone,
    }),
  };
  if (
    moved["@type"] === "Task" &&
    moved.due !== undefined &&
    entry.start !== undefined
  ) {
    moved.due = shift(moved.due, entry.start, recurrenceId);
  }
  const changes = Object.entries(recurrenceOverrides ?? {}).find(
    ([id]) => normal(id) === recurrenceId,
  )?.[1];
  if (changes === undefined || !overrides(changes)) return moved;
  try {
    return patch(moved, changes);
  } catch {
    return moved;
  }
};

/** The recurrence ids of an entry's overrides, and whether each is excluded. */
const overridden = (entry: Entry): Map<LocalDateTime, boolean> =>
  new Map(
    Object.entries(entry.recurrenceOverrides ?? {}).map(([id, changes]) => [
      normal(id),
      changes.excluded === true,
    ]),
  );

/**
 * The occurrences of the entries inside a range, by start: each entry
 * that does not recur where its span meets the range, and each occurrence
 * of one that does, from its rule and its overrides. An occurrence served
 * as an entry of its own stands for the one its base would give.
 */
export const expand = (
  entries: Entry[],
  range: Range,
  zone: TimeZoneId,
): Found[] => {
  const from = Temporal.Instant.from(range.start);
  const to = Temporal.Instant.from(range.end);
  const found = new Map<string, Found>();

  const add = (entry: Entry, source: number, recurrenceId?: LocalDateTime) => {
    const span = spanOf(entry, zone);
    if (span === null) return;
    const start = span.start.toInstant();
    const end = span.end.toInstant();
    const before = Temporal.Instant.compare(start, to) < 0;
    const after =
      Temporal.Instant.compare(end, from) > 0 ||
      Temporal.Instant.compare(start, from) >= 0;
    if (!before || !after) return;
    const key = keyOf(entry.uid, recurrenceId);
    found.set(key, {
      source,
      occurrence: {
        key,
        uid: entry.uid,
        ...(recurrenceId !== undefined && { recurrenceId }),
        entry,
        start: utc(span.start),
        end: utc(span.end),
        allDay: entry.showWithoutTime === true,
      },
    });
  };

  // The recurring entries first, so an occurrence served on its own
  // replaces the one its base gives.
  for (const [source, entry] of entries.entries()) {
    if (!recurs(entry) || entry.start === undefined) continue;
    const base = spanOf(entry, zone);
    if (base === null) continue;
    const held = overridden(entry);
    const ids = new Set<LocalDateTime>(held.keys());
    if (entry.recurrenceRule === undefined) {
      ids.add(normal(entry.start));
    } else {
      // An occurrence that starts before the range may still reach into it.
      const reach = base.start.until(base.end, { largestUnit: "hours" });
      const rule = ruleOf(entry.recurrenceRule, base.start);
      const window = rule.between(
        from.subtract(reach).toZonedDateTimeISO(base.start.timeZoneId),
        to.toZonedDateTimeISO(base.start.timeZoneId),
        true,
      );
      for (const at of window) ids.add(local(at));
    }
    for (const id of ids) {
      if (held.get(id) === true) continue;
      add(instanceOf(entry, id), source, id);
    }
  }
  for (const [source, entry] of entries.entries()) {
    if (recurs(entry)) continue;
    add(
      entry,
      source,
      entry.recurrenceId === undefined ? undefined : normal(entry.recurrenceId),
    );
  }

  return [...found.values()].sort(
    (a, b) =>
      a.occurrence.start.localeCompare(b.occurrence.start) ||
      a.occurrence.key.localeCompare(b.occurrence.key),
  );
};
