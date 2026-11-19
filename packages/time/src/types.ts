import type { Entry, LocalDateTime, UTCDateTime } from "./jscalendar";

/**
 * A span of time between two instants: from `start`, up to and not
 * including `end`.
 */
export type Range = {
  start: UTCDateTime;
  end: UTCDateTime;
};

/**
 * One occurrence of an entry inside a range: the entry itself where it
 * does not recur, or one instance of its recurrence.
 */
export type Occurrence = {
  /**
   * The occurrence's identity: the entry's `uid`, joined with the
   * recurrence id where the entry recurs.
   */
  key: string;
  /** The `uid` of the entry it is an occurrence of. */
  uid: string;
  /** The recurrence id, where the entry recurs. */
  recurrenceId?: LocalDateTime;
  /**
   * The occurrence as a JSCalendar object: the entry with its override
   * applied, its `recurrenceId` set, and its rule and overrides left out.
   * The entry itself where it does not recur.
   */
  entry: Entry;
  /** The instant it starts. */
  start: UTCDateTime;
  /** The instant it ends. The start, for an entry with no duration. */
  end: UTCDateTime;
  /** Whether the entry shows without its time. */
  allDay: boolean;
};

/** An occurrence with the entry it was read from, by its place in the entries. */
export type Found = { occurrence: Occurrence; source: number };
