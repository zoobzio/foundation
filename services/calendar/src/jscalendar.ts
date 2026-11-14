/**
 * JSCalendar 2.0, the calendar's own form, as types: what a reader
 * produces and a writer consumes. After draft-ietf-calext-jscalendarbis-22,
 * the revision of RFC 8984 in IETF Last Call; the names, the types, and
 * the defaults below are the draft's.
 *
 * The types describe the whole format, not the part the service
 * interprets. The service reads what schedules an entry (its start, its
 * duration, its time zones, its recurrence) and carries every other
 * property as it found it, a property it does not know included: the
 * format requires that an unknown property be preserved.
 */

/**
 * A value from a list the format leaves open: one of the registered
 * values, or any other string, a value registered later or a vendor's
 * (`example.com:value`).
 */
export type Open<T extends string> = T | (string & {});

/**
 * The format's set: a map whose keys are the members and whose values are
 * all `true`.
 */
export type Members<K extends string = string> = { [key in K]?: true };

/**
 * A vendor's properties, which any object may carry: the name is a domain
 * the vendor controls, a colon, and a name (`example.com:room`).
 */
export type Vendor = { [property: `${string}:${string}`]: unknown };

/** A key of a map: 1 to 255 characters of `A-Za-z0-9`, `-` and `_`. */
export type Id = string;

/** An instant: `2026-03-01T09:00:00Z`. No fractional seconds. */
export type UTCDateTime = string;

/**
 * A wall-clock date-time with no offset: `2026-03-01T09:00:00`. Its time
 * zone is its object's `timeZone`; without one it floats, the same wall
 * clock in every zone. A value inside a zone's gap or overlap reads with
 * the offset before the transition.
 */
export type LocalDateTime = string;

/**
 * An ISO 8601 duration of weeks or days and a time: `P1D`, `PT1H30M`. The
 * days are added to the local date first and the time to the instant, so
 * a day is not always 24 hours.
 */
export type Duration = string;

/** A duration with an optional sign: `-PT15M` is before its reference. */
export type SignedDuration = string;

/** A name of the IANA Time Zone Database: `Europe/Amsterdam`. */
export type TimeZoneId = string;

/**
 * A set of changes to an object, by JSON pointer with the leading `/`
 * left off: `title`, `locations/a1/name`, `alerts/x/trigger`. A value
 * sets the property; `null` removes one that is optional. A pointer may
 * end at an array member that exists, and replaces it; it cannot insert
 * or remove one. One invalid change voids the whole object.
 */
export type PatchObject = Record<string, unknown>;

export type Relation = Vendor & {
  "@type"?: "Relation";
  /** How the linked object relates; empty reads as `parent`. */
  relation?: Members<Open<"first" | "next" | "child" | "parent">>;
};

export type Link = Vendor & {
  "@type"?: "Link";
  href: string;
  contentType?: string;
  size?: number;
  /** A link relation type. Defaults to `enclosure`, an attachment. */
  rel?: Open<"enclosure" | "describedby" | "icon">;
  /** What an image is for. Only with a `rel` of `icon`. */
  display?: Members<Open<"badge" | "graphic" | "fullsize" | "thumbnail">>;
  title?: string;
};

export type Location = Vendor & {
  "@type"?: "Location";
  name?: string;
  locationTypes?: Members;
  /** A `geo:` URI. */
  coordinates?: string;
  links?: Record<Id, Link>;
};

export type VirtualLocation = Vendor & {
  "@type"?: "VirtualLocation";
  name?: string;
  uri: string;
  features?: Members<
    Open<"audio" | "chat" | "feed" | "moderator" | "phone" | "screen" | "video">
  >;
};

export type Weekday = "mo" | "tu" | "we" | "th" | "fr" | "sa" | "su";

export type Frequency =
  | "yearly"
  | "monthly"
  | "weekly"
  | "daily"
  | "hourly"
  | "minutely"
  | "secondly";

/** A weekday of a rule: every one, or the nth of its month or year. */
export type NDay = Vendor & {
  "@type"?: "NDay";
  day: Weekday;
  /** Never zero. Negative counts from the end: `-1` is the last. */
  nthOfPeriod?: number;
};

/**
 * A repeating pattern, with the meaning of iCalendar's RECUR: each
 * property is the RRULE part of the same name, in lower case. The object's
 * start is always the first occurrence, and counts toward `count`, whether
 * or not it matches the rule.
 */
export type RecurrenceRule = Vendor & {
  "@type"?: "RecurrenceRule";
  frequency: Frequency;
  /** At least 1. Defaults to 1. */
  interval?: number;
  /** The calendar system the rule counts in. Defaults to `gregorian`. */
  rscale?: string;
  /** What a date that does not exist becomes. Defaults to `omit`. */
  skip?: "omit" | "backward" | "forward";
  /** Defaults to `mo`. */
  firstDayOfWeek?: Weekday;
  byDay?: NDay[];
  byMonthDay?: number[];
  /** Month numbers as strings, from `"1"`; `"3L"` is a leap month. */
  byMonth?: string[];
  byYearDay?: number[];
  byWeekNo?: number[];
  byHour?: number[];
  byMinute?: number[];
  bySecond?: number[];
  bySetPosition?: number[];
  /** Never with `until`. */
  count?: number;
  /**
   * The last occurrence is on or before it, in the object's time zone.
   * Never with `count`.
   */
  until?: LocalDateTime;
};

export type Participant = Vendor & {
  "@type"?: "Participant";
  name?: string;
  email?: string;
  description?: string;
  descriptionContentType?: string;
  calendarAddress?: string;
  kind?: Open<"individual" | "group" | "location" | "resource">;
  roles?: Members<
    Open<"owner" | "optional" | "informational" | "chair" | "required">
  >;
  /** Defaults to `needs-action`. */
  participationStatus?: Open<
    "needs-action" | "accepted" | "declined" | "tentative" | "delegated"
  >;
  expectReply?: boolean;
  sentBy?: string;
  delegatedTo?: Members;
  delegatedFrom?: Members;
  memberOf?: Members;
  links?: Record<Id, Link>;
  /** On a task's participant alone. */
  progress?: Open<"in-process" | "completed" | "failed">;
  /** On a task's participant alone. 0 to 100. */
  percentComplete?: number;
};

export type OffsetTrigger = Vendor & {
  "@type"?: "OffsetTrigger";
  offset: SignedDuration;
  /** Defaults to `start`. `end` is an event's end or a task's due time. */
  relativeTo?: "start" | "end";
};

export type AbsoluteTrigger = Vendor & {
  "@type": "AbsoluteTrigger";
  when: UTCDateTime;
};

/** A trigger of a type this version does not define. Kept, never fired. */
export type UnknownTrigger = { "@type": string; [property: string]: unknown };

export type Alert = Vendor & {
  "@type"?: "Alert";
  /** An offset trigger where it names no type. */
  trigger: OffsetTrigger | AbsoluteTrigger | UnknownTrigger;
  acknowledged?: UTCDateTime;
  relatedTo?: Record<string, Relation>;
  /** Defaults to `display`. */
  action?: Open<"display" | "email">;
};

/**
 * The properties an event and a task share.
 */
export type Common = Vendor & {
  /** Shared by every occurrence of a recurring object. */
  uid: string;
  /**
   * The JSCalendar version. Set on an object that stands alone, never on
   * an entry of a group, which takes its group's. A standalone object
   * without one is version `1.0`, RFC 8984.
   */
  version?: Open<"2.0">;
  /** The related objects, by their `uid`. */
  relatedTo?: Record<string, Relation>;
  prodId?: string;
  created?: UTCDateTime;
  updated: UTCDateTime;
  sequence?: number;
  method?: string;

  title?: string;
  description?: string;
  /** Defaults to `text/plain`. */
  descriptionContentType?: string;
  /** An all-day object: the time is kept, and a view leaves it out. */
  showWithoutTime?: boolean;
  locations?: Record<Id, Location>;
  mainLocationId?: Id;
  virtualLocations?: Record<Id, VirtualLocation>;
  links?: Record<Id, Link>;
  locale?: string;
  keywords?: Members;
  categories?: Members;
  /** A CSS color name or a six-digit hex value. */
  color?: string;

  /**
   * Set on one occurrence of a recurring object served on its own: the
   * date-time the base's rule or overrides gave it. Never with
   * `recurrenceRule` or `recurrenceOverrides`.
   */
  recurrenceId?: LocalDateTime;
  /** The base object's time zone. Only with `recurrenceId`. */
  recurrenceIdTimeZone?: TimeZoneId;
  recurrenceRule?: RecurrenceRule;
  /**
   * The exceptions, by recurrence id. `{ excluded: true }`, alone, drops
   * the occurrence; any other patch changes it, its `start` included; an
   * id the rule does not give adds one. A patch never touches `uid`,
   * `recurrenceRule`, or `recurrenceOverrides`.
   */
  recurrenceOverrides?: Record<LocalDateTime, PatchObject>;

  /** 0, undefined, or 1 (highest) to 9 (lowest). */
  priority?: number;
  /** Defaults to `busy`. */
  freeBusyStatus?: Open<"free" | "busy">;
  /** Defaults to `public`. An unknown value reads as `private`. */
  privacy?: Open<"public" | "private" | "secret">;
  organizerCalendarAddress?: string;
  sentBy?: string;
  participants?: Record<Id, Participant>;
  alerts?: Record<Id, Alert>;

  /** Without one the object floats. */
  timeZone?: TimeZoneId;
};

/** A scheduled span of time: a meeting, an appointment, an anniversary. */
export type Event = Common & {
  "@type": "Event";
  start: LocalDateTime;
  /** Zero or more. Defaults to `PT0S`. The end is the start plus it. */
  duration?: Duration;
  /**
   * Where the event ends in another zone than it starts in. Only with
   * `timeZone`.
   */
  endTimeZone?: TimeZoneId;
  /** Defaults to `confirmed`. */
  status?: Open<"confirmed" | "cancelled" | "tentative">;
};

/** An action item. It may start, be due, and recur; none is required. */
export type Task = Common & {
  "@type": "Task";
  due?: LocalDateTime;
  /** Required by `recurrenceRule` and by `recurrenceId`. */
  start?: LocalDateTime;
  estimatedDuration?: Duration;
  /** 0 to 100. */
  percentComplete?: number;
  /** Without one it follows from the participants' progress. */
  progress?: Open<
    "needs-action" | "in-process" | "completed" | "failed" | "cancelled"
  >;
};

/** An object a calendar holds. */
export type Entry = Event | Task;

/** A collection of entries: a calendar, or the entries of one topic. */
export type Group = Vendor & {
  "@type": "Group";
  uid: string;
  version: Open<"2.0">;
  prodId?: string;
  created?: UTCDateTime;
  updated: UTCDateTime;
  title?: string;
  description?: string;
  descriptionContentType?: string;
  links?: Record<Id, Link>;
  locale?: string;
  keywords?: Members;
  categories?: Members;
  color?: string;
  entries: Entry[];
  /** A URI the group's later versions are served from. */
  source?: string;
};
