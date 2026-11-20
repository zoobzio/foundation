import type { Day, JSCalendar, Occurrence, Range, Scope } from "@zoobzio/time";
import type {
  Clause,
  Field,
  Filter,
  Literal,
  Service as Query,
  Suggest,
} from "@zoobzio/query";
import type {
  Config as SyncConfig,
  Service as Sync,
  State as SyncState,
} from "@zoobzio/sync";
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
export type Doc = JSCalendar.Entry[];

/**
 * How much of time a view shows at once.
 */
export type View = "month" | "week" | "day" | "agenda";

/**
 * What the fetch is handed: the range the view shows, and the search:
 * `query` is the committed free text, `filters` the committed field
 * filters. The calendar gives neither a meaning: the consumer answers
 * with the entries of the range that match them.
 */
export type FetchParams = {
  range: Range;
  query: string;
  filters: Filter[];
};

/**
 * What the refresh is handed: what the fetch is, and `since`, the mark of
 * the entries the calendar holds.
 */
export type RefreshParams = FetchParams & {
  since: string;
};

/**
 * What a refresh answers. Nothing, or `false`: nothing changed, and the
 * calendar keeps its entries. `true`: something did, and the calendar
 * fetches the range again itself. Anything else is the entries of the
 * range as they now stand, in the consumer's form, read in as a fetch's
 * are.
 */
export type RefreshResult<I> = I | boolean | null | undefined | void;

/**
 * The calendar as a visitor arranged it: the part of the container a
 * saved view holds, the view, the query's clauses, and the interval of
 * the sync. The date, the
 * entries, the selection, and the draft are not part of it: a saved view
 * opens on the day the calendar stands on. Plain data, so it survives
 * JSON.
 */
export type Snapshot = {
  view: View;
  clauses: Clause[];
  interval: number;
};

/**
 * Config the consumer provides. Plain serializable data, except that a
 * field's `values` may be a provider.
 */
export type Config = {
  /**
   * The sync's config, handed to it as given: the intervals a visitor may
   * pick from, and the one the calendar starts on. Read only where the
   * actions name a `refresh`.
   */
  sync?: SyncConfig;
  /** The views the calendar offers. Defaults to all of them. */
  views?: View[];
  /** The view a fresh container starts in. Defaults to the first of `views`. */
  view?: View;
  /**
   * The IANA time zone the calendar is read in: the zone its days are
   * days of, a floating entry is placed in, and `today` is read in.
   * Defaults to `UTC`, so a server and a browser lay out the same days.
   */
  timeZone?: JSCalendar.TimeZoneId;
  /** The BCP 47 locale a view formats in. Defaults to `en-US`. */
  locale?: string;
  /** The day a week starts on. Defaults to `mo`. */
  firstDayOfWeek?: JSCalendar.Weekday;
  /**
   * The fields the query filters on, keyed by the identity a filter
   * carries: the model of an entry as a search reads it, a calendar, a
   * category, a participant. The calendar reads none of them off its
   * entries: the fetch is handed the filters and answers for them.
   * Defaults to none.
   */
  fields?: Record<string, Field>;
  /**
   * The literals of the query, handed to it as given. Defaults to the
   * query's, the text literal alone; the calendar reads the `text` literal
   * as the fetch's `query`.
   */
  literals?: Record<string, Literal>;
  /** The clauses the query starts from. */
  initialClauses?: Clause[];
  /**
   * Whether a UI renders the toolbar search. Defaults to whether the
   * config names `fields` or `literals`. A hint for the view layer only:
   * the search surface on the service (`query`, the fetch params) stays
   * live for imperative use.
   */
  searchable?: boolean;
};

/**
 * The state container the service reads and writes: the view, the day it
 * is anchored on, the entries the range loaded, the fetch flags, the
 * revision, which counts every change to the entries, the selected
 * occurrence, the query's slice: its clauses, its draft, and what a
 * values provider has given for it, and the sync's: its interval, its
 * mark, and whether a poll is out. The entries are JSCalendar, plain JSON, so the container
 * carries them across SSR as it stands. The occurrences are not here:
 * they are read from the entries and the range. The container can be a
 * plain object or a reactive proxy; the service replaces each member as a
 * whole.
 */
export type State = SyncState & {
  view: View;
  date: Day;
  entries: JSCalendar.Entry[];
  loading: boolean;
  initialized: boolean;
  revision: number;
  selected: string | null;
  clauses: Clause[];
  draft: string;
  suggest: Suggest;
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
  timeZone: JSCalendar.TimeZoneId;
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
   * Loads the entries of a range that the search leaves, in the
   * consumer's form. Every such entry with an occurrence inside the range
   * belongs in the result, a recurring one whole: the service expands its
   * rule.
   */
  fetch: (params: FetchParams, service: Service<I, O>) => Promise<I>;
  /**
   * The poll of the calendar's sync: asked what changed in the range
   * since the entries the calendar holds were read. With it the calendar
   * has a `sync`, and a visitor may keep the range alive on an interval;
   * without it the calendar refreshes by `fetch` alone.
   */
  refresh?: (
    params: RefreshParams,
    service: Service<I, O>,
  ) => RefreshResult<I> | Promise<RefreshResult<I>>;
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
 * - `loaded`: a fetch settled, success or failure, a source was loaded, or
 *   a refresh landed the entries.
 * - `changed`: a command changed the entries, and the save, if any, settled.
 * - `selected`: the selected occurrence changed.
 * - `filtered`: the query's clauses changed.
 * - `restored`: a snapshot replaced the arrangement.
 */
export type Events<O> = ChangeEvents<State> & {
  navigated: [event: { id: string; view: View; date: Day; range: Range }];
  loaded: [event: { id: string; range: Range; revision: number }];
  changed: [event: { id: string; revision: number; mutation: Mutation<O> }];
  selected: [event: { id: string; key: string | null }];
  filtered: [event: { id: string; query: string; filters: Filter[] }];
  restored: [event: { id: string; snapshot: Snapshot }];
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
  readonly searchable: boolean;

  /**
   * The sync machine, where the actions name a `refresh`: the interval a
   * visitor keeps the range alive on. It polls the refresh with the mark
   * of the entries held, and every load marks it anew. `undefined`
   * without a refresh.
   */
  readonly sync: Sync | undefined;

  /**
   * The query machine over the config's fields. A change to its clauses
   * refetches the range.
   */
  readonly query: Query;

  readonly view: View;
  readonly date: Day;
  readonly entries: JSCalendar.Entry[];
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
  create(entry: JSCalendar.Entry): Promise<void>;
  /**
   * Patches an occurrence, an occurrence and every later one, or its
   * whole entry. `one` writes the patch into the entry's
   * `recurrenceOverrides`; `following` cuts the entry's rule short and
   * adds the entry that follows it; `all` patches the entry.
   */
  update(
    key: string,
    patch: JSCalendar.PatchObject,
    scope?: Scope,
  ): Promise<void>;
  /** Removes an occurrence, an occurrence and every later one, or its entry. */
  remove(key: string, scope?: Scope): Promise<void>;

  /**
   * The arrangement as it stands. Each member is the container's own, so
   * a read inside a reactive scope tracks it.
   */
  snapshot(): Snapshot;
  /**
   * Puts an arrangement in place: the view and the query's clauses, in
   * one fetch. Before `init` it fetches nothing: the first fetch reads
   * what it left. A view the calendar does not offer is left out, and so
   * is a clause the query rejects: `snapshot` then differs from what was
   * restored.
   */
  restore(snapshot: Snapshot): void;

  on<E extends Event<O>>(event: E, listener: Listener<O, E>): () => void;
};
