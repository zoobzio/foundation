import type {
  Entry,
  LocalDateTime,
  PatchObject,
  TimeZoneId,
  UTCDateTime,
  Weekday,
} from "./jscalendar";
import type {
  Change as KitChange,
  ChangeEvents,
  Changers as KitChangers,
  Changes as KitChanges,
  Codec as KitCodec,
  Listener as KitListener,
  Middleware as KitMiddleware,
  Options as KitOptions,
  Step,
} from "@zoobzio/kit";

/**
 * The calendar's own form: JSCalendar entries. What a reader produces and
 * a writer consumes.
 */
export type Doc = Entry[];

/**
 * How much of time a view shows at once.
 */
export type View = "month" | "week" | "day" | "agenda";

/**
 * A calendar day, `YYYY-MM-DD`, as it reads in the config's time zone.
 */
export type Day = string;

/**
 * A span of time between two instants: from `start`, up to and not
 * including `end`.
 */
export type Range = {
  start: UTCDateTime;
  end: UTCDateTime;
};

/**
 * Config the consumer provides — pure serializable data.
 */
export type Config = {
  /** The views the calendar offers. Defaults to all of them. */
  views?: View[];
  /** The view a fresh container starts in. Defaults to the first of `views`. */
  view?: View;
  /**
   * The IANA time zone the calendar is read in: the zone its days are
   * days of, a floating entry is placed in, and `today` is read in.
   * Defaults to `UTC`, so a server and a browser lay out the same days.
   */
  timeZone?: TimeZoneId;
  /** The BCP 47 locale a view formats in. Defaults to `en-US`. */
  locale?: string;
  /** The day a week starts on. Defaults to `mo`. */
  firstDayOfWeek?: Weekday;
};

/**
 * One occurrence of an entry inside the range: the entry itself where it
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

/**
 * How much of a recurring entry a change reaches: the one occurrence, the
 * occurrence and every later one, or the whole entry. An entry that does
 * not recur has `all` alone.
 */
export type Scope = "one" | "following" | "all";

/**
 * The state container the service reads and writes: the view, the day it
 * is anchored on, the entries the range loaded, the fetch flags, the
 * revision, which counts every change to the entries, and the selected
 * occurrence. The entries are JSCalendar, plain JSON, so the container
 * carries them across SSR as it stands. The occurrences are not here:
 * they are read from the entries and the range. The container can be a
 * plain object or a reactive proxy; the service replaces each member as a
 * whole.
 */
export type State = {
  view: View;
  date: Day;
  entries: Entry[];
  loading: boolean;
  initialized: boolean;
  revision: number;
  selected: string | null;
};

export type StateKey = keyof State;

export type Middleware = KitMiddleware<State>;
export type Options = KitOptions<State>;
export type Changes = KitChanges<State>;
export type Change<K extends StateKey = StateKey> = KitChange<State, K>;
export type Changers = KitChangers<State>;

/**
 * What a reader or writer may ask of the calendar: the zone and the
 * locale it reads in.
 */
export type Context = {
  timeZone: TimeZoneId;
  locale: string;
};

/**
 * Ingestion: a source in the consumer's form `I`, as entries. Synchronous.
 */
export type Reader<I> = Step<I, Doc, Context>;

/**
 * Consumption: entries as the consumer's form `O`.
 */
export type Writer<O> = Step<Doc, O, Context>;

/**
 * The kit's codec bound to the calendar's entries: a reader and a writer
 * over one form, or over two when ingestion and consumption differ.
 */
export type Codec<I, O = I> = KitCodec<I, Doc, O, Context>;

/**
 * A change to the entries, as the consumer persists it, through the
 * writer: the entries to store, new or replaced by `uid`, and the entries
 * to delete. A change to this and every later occurrence stores two: the
 * entry cut short, and the new one that follows it.
 */
export type Mutation<O> = {
  scope: Scope;
  entries: O;
  removed: O;
};

/**
 * The consumer-supplied behavior: the reader and writer, the fetch that
 * loads a range, and the save that persists a change.
 */
export type Actions<I, O> = Codec<I, O> & {
  /**
   * Loads the entries of a range, in the consumer's form. Every entry
   * with an occurrence inside the range belongs in the result, a
   * recurring one whole: the service expands its rule.
   */
  fetch: (range: Range, service: Service<I, O>) => Promise<I>;
  /**
   * Persists a change the service has already applied to its entries. A
   * rejection puts the entries back as they were and reaches the caller
   * of the command. Without it a change stays in the container, and
   * `changed` is where a consumer hears of it.
   */
  save?: (mutation: Mutation<O>, service: Service<I, O>) => Promise<void>;
  /** The clock `today` and an entry's `updated` are read from. */
  now?: () => Date;
  /** The `uid` of an entry the service makes. Defaults to a random UUID. */
  uid?: () => string;
};

/**
 * The events of a calendar service, keyed by name.
 *
 * - `change`: a field of the container was written.
 * - `navigated`: the view or the date moved, and with them the range.
 * - `loaded`: a fetch settled, success or failure, or a source was loaded.
 * - `changed`: a command changed the entries, and the save, if any, settled.
 * - `selected`: the selected occurrence changed.
 */
export type Events<O> = ChangeEvents<State> & {
  navigated: [event: { id: string; view: View; date: Day; range: Range }];
  loaded: [event: { id: string; range: Range; revision: number }];
  changed: [event: { id: string; revision: number; mutation: Mutation<O> }];
  selected: [event: { id: string; key: string | null }];
};

export type Event<O> = keyof Events<O>;

export type Listener<O, E extends Event<O>> = KitListener<Events<O>, E>;

/**
 * The calendar machine: the entries of a range, read in through the
 * reader, written out through the writer, expanded into the occurrences a
 * view lays out.
 */
export type Service<I, O> = {
  readonly id: string;
  readonly config: Config;
  readonly context: Context;
  readonly views: View[];

  readonly view: View;
  readonly date: Day;
  readonly entries: Entry[];
  readonly loading: boolean;
  readonly initialized: boolean;
  readonly revision: number;
  readonly selected: string | null;

  /** The span the view shows around the date: what a fetch loads. */
  readonly range: Range;
  /** The days of the range, in order. */
  readonly days: Day[];
  /** Today, as the day reads in the config's time zone. */
  readonly today: Day;
  /**
   * The occurrences inside the range, by start. Read from the entries on
   * read, tied to the revision, so a reactive container recomputes them
   * on every change.
   */
  readonly occurrences: Occurrence[];
  /** The entries in the consumer's form, through the writer. */
  readonly document: O;

  /** Fetches the range once, where the container holds none. */
  init(): Promise<boolean>;
  fetch(): Promise<void>;
  /** Replaces the entries through the reader, with no fetch. */
  load(source: I): void;

  show(view: View): void;
  go(date: Day): void;
  next(): void;
  prev(): void;

  select(key: string | null): void;
  occurrence(key: string): Occurrence | undefined;
  /** The occurrences that touch a day of the config's zone, by start. */
  occurrencesOn(day: Day): Occurrence[];

  /** Adds an entry. */
  create(entry: Entry): Promise<void>;
  /**
   * Patches an occurrence, an occurrence and every later one, or its
   * whole entry. `one` writes the patch into the entry's
   * `recurrenceOverrides`; `following` cuts the entry's rule short and
   * adds the entry that follows it; `all` patches the entry.
   */
  update(key: string, patch: PatchObject, scope?: Scope): Promise<void>;
  /** Removes an occurrence, an occurrence and every later one, or its entry. */
  remove(key: string, scope?: Scope): Promise<void>;

  on<E extends Event<O>>(event: E, listener: Listener<O, E>): () => void;
};
