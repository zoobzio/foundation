import type { Group, Grouping, Order, RecordData } from "./types";

import { TIMELINE_GROUP_LENGTHS } from "./constants";

/**
 * A value as a time: an ISO 8601 date-time, a count of milliseconds since
 * the epoch, or a `Date`. `null` for anything that does not read as one.
 */
export const timeOf = (value: unknown): Date | null => {
  if (
    typeof value !== "string" &&
    typeof value !== "number" &&
    !(value instanceof Date)
  ) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** One formatter per zone: a timeline reads the day of every record it holds. */
const formats = new Map<string, Intl.DateTimeFormat>();

/** The day an instant falls on in a zone, `YYYY-MM-DD`. */
export const dayOf = (date: Date, zone: string): string => {
  let format = formats.get(zone);
  if (!format) {
    format = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    formats.set(zone, format);
  }
  const parts: Record<string, string> = {};
  for (const part of format.formatToParts(date)) parts[part.type] = part.value;
  return `${parts.year}-${parts.month}-${parts.day}`;
};

/**
 * The key of the group a time falls in: its day in the zone, cut to the
 * grouping. Empty for no time, and where nothing is grouped.
 */
export const groupOf = (
  date: Date | null,
  grouping: Grouping,
  zone: string,
): string =>
  date === null || grouping === "none"
    ? ""
    : dayOf(date, zone).slice(0, TIMELINE_GROUP_LENGTHS[grouping]);

/**
 * The records in their groups: each run of records that share a key, in
 * the order the records come. The records are not sorted, so two runs of
 * one day apart from each other are two groups; one group, of them all,
 * where nothing is grouped.
 */
export const groupsOf = <T extends RecordData>(
  records: T[],
  key: (record: T) => string,
): Group<T>[] => {
  const groups: Group<T>[] = [];
  for (const record of records) {
    const at = key(record);
    const last = groups[groups.length - 1];
    if (last && last.key === at) last.records.push(record);
    else groups.push({ key: at, records: [record] });
  }
  return groups;
};

/**
 * Lays records into the ones held, by key: one already held is replaced
 * where it stands, and a new one is placed by its time, in the order the
 * timeline runs, ahead of the held ones of the same time. The held
 * records keep the order they have.
 */
export const merge = <T extends RecordData>(
  held: T[],
  incoming: T[],
  key: (record: T) => string,
  time: (record: T) => number,
  order: Order,
): T[] => {
  const fresh = new Map(incoming.map((record) => [key(record), record]));
  const result = held.map((record) => {
    const id = key(record);
    const next = fresh.get(id);
    if (next === undefined) return record;
    fresh.delete(id);
    return next;
  });
  const ahead = (a: number, b: number) => (order === "desc" ? a >= b : a <= b);
  for (const record of fresh.values()) {
    const at = time(record);
    const index = result.findIndex((other) => ahead(at, time(other)));
    result.splice(index < 0 ? result.length : index, 0, record);
  }
  return result;
};
