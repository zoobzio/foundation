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
  Listener as KitListener,
  Middleware as KitMiddleware,
  Options as KitOptions,
} from "@zoobzio/kit";

/** A record of the timeline: the consumer's own, a plain object. */
export type RecordData = object;

/** The name of a property of a record, as the config points at one. */
export type Property<T extends RecordData> = keyof T & string;

/**
 * What the records are grouped under: the day, the month, or the year
 * each falls in, or nothing, one group of them all.
 */
export type Grouping = "day" | "month" | "year" | "none";

/**
 * The way the records run: `desc` from the latest back, as a feed reads,
 * or `asc` from the earliest on.
 */
export type Order = "desc" | "asc";

/**
 * A run of records that share a day, a month, or a year. `key` is the
 * span as the config's zone reads it, `YYYY-MM-DD`, `YYYY-MM`, or `YYYY`;
 * empty for the one group of a timeline that groups by nothing, and for
 * the records whose time does not read as one.
 */
export type Group<T extends RecordData> = {
  key: string;
  records: T[];
};

/**
 * What the fetch is handed: where to read from, how many to read, and the
 * search. `cursor` is `null` for the first batch, and after it the one
 * the batch before answered with. `query` is the committed free text,
 * `filters` the committed field filters; the timeline gives neither a
 * meaning.
 */
export type FetchParams = {
  cursor: string | null;
  limit: number;
  query: string;
  filters: Filter[];
};

/**
 * One batch of records, in the order the timeline runs, and the cursor of
 * the batch after it: `null`, or left out, where there is none. `since`
 * is the mark the batch is whole as of, what the next refresh is asked
 * for changes since; without it the mark is the visitor's clock as the
 * request was made.
 */
export type FetchResult<T extends RecordData> = {
  data: T[];
  cursor?: string | null;
  since?: string;
};

/**
 * What the refresh is handed: what the fetch of the first batch is, and
 * `since`, the mark of the records the timeline holds.
 */
export type RefreshParams = FetchParams & {
  since: string;
};

/**
 * What a refresh answers. Nothing, or `false`: nothing changed, and the
 * timeline keeps its records. `true`: something did, and the timeline
 * fetches the first batch again itself. A result: the records that are
 * new or changed. Either way what comes back is laid into the records
 * held, by key, and not in their place: what a visitor loaded further
 * down stays.
 */
export type RefreshResult<T extends RecordData> =
  | FetchResult<T>
  | boolean
  | null
  | undefined
  | void;

/**
 * The timeline as a visitor arranged it: the part of the container a
 * saved view holds, the query's clauses and the interval of the sync. The
 * records, how far down they were loaded, the selection, and the draft
 * are not part of it. Plain data, so it survives JSON.
 */
export type Snapshot = {
  clauses: Clause[];
  interval: number;
};

/**
 * Config the consumer provides. Plain serializable data, except that a
 * field's `values` may be a provider.
 */
export type Config<T extends RecordData> = {
  /** The property that tells one record from another. Defaults to `id`. */
  key?: Property<T>;
  /**
   * The property that holds a record's time: an ISO 8601 date-time, a
   * count of milliseconds since the epoch, or a `Date`. Defaults to `at`.
   */
  at?: Property<T>;
  /**
   * The property a view reads as a record's name where it is given
   * nothing else to draw. Defaults to the key.
   */
  label?: Property<T>;
  /**
   * The way the records run, which the fetch answers in. Defaults to
   * `desc`. The timeline orders nothing a fetch answers; it reads this to
   * place what a refresh brings.
   */
  order?: Order;
  /** What the records are grouped under. Defaults to `day`. */
  group?: Grouping;
  /** How many records a batch asks for. Defaults to 30. */
  limit?: number;
  /**
   * The IANA time zone the timeline is read in: the zone a record's day
   * is a day of, and `today` is read in. Defaults to `UTC`, so a server
   * and a browser group the same records together.
   */
  timeZone?: string;
  /** The BCP 47 locale a view formats in. Defaults to `en-US`. */
  locale?: string;
  /**
   * The fields the query filters on, keyed by the identity a filter
   * carries. The timeline reads none of them off its records: the fetch
   * is handed the filters and answers for them. Defaults to none.
   */
  fields?: Record<string, Field>;
  /**
   * The literals of the query, handed to it as given. Defaults to the
   * query's, the text literal alone; the timeline reads the `text`
   * literal as the fetch's `query`.
   */
  literals?: Record<string, Literal>;
  /** The clauses the query starts from. */
  initialClauses?: Clause[];
  /**
   * Whether a UI renders the search. Defaults to whether the config names
   * `fields` or `literals`. A hint for the view layer only: the search
   * surface on the service (`query`, the fetch params) stays live for
   * imperative use.
   */
  searchable?: boolean;
  /**
   * The sync's config, handed to it as given: the intervals a visitor may
   * pick from, and the one the timeline starts on. Read only where the
   * actions name a `refresh`.
   */
  sync?: SyncConfig;
};

/**
 * The state container the service reads and writes: the records loaded so
 * far, the cursor of the batch after them, the fetch flags, `loading`
 * while the records are fetched anew and `appending` while a further
 * batch is, the selected record, the query's slice, and the sync's. The
 * groups are not here: they are read from the records. The container can
 * be a plain object or a reactive proxy; the service replaces each member
 * as a whole.
 */
export type State<T extends RecordData> = SyncState & {
  records: T[];
  cursor: string | null;
  loading: boolean;
  appending: boolean;
  initialized: boolean;
  selected: string | null;
  clauses: Clause[];
  draft: string;
  suggest: Suggest;
};

export type StateKey = keyof State<RecordData>;

export type Middleware<T extends RecordData> = KitMiddleware<State<T>>;
export type Options<T extends RecordData> = KitOptions<State<T>>;
export type Changes<T extends RecordData> = KitChanges<State<T>>;
export type Change<
  T extends RecordData,
  K extends StateKey = StateKey,
> = KitChange<State<T>, K>;
export type Changers<T extends RecordData> = KitChangers<State<T>>;

/**
 * What a view may ask of the timeline to format by: the zone and the
 * locale it reads in.
 */
export type Context = {
  timeZone: string;
  locale: string;
};

/**
 * The consumer-supplied behavior: the fetch that loads a batch, and the
 * refresh a sync polls.
 */
export type Actions<T extends RecordData> = {
  /**
   * Loads a batch: the first where the cursor is `null`, and the one a
   * cursor names after it. The records come in the order the timeline
   * runs, with the cursor of the batch after them, if there is one.
   */
  fetch: (params: FetchParams, service: Service<T>) => Promise<FetchResult<T>>;
  /**
   * The poll of the timeline's sync: asked what changed since the records
   * the timeline holds were read. With it the timeline has a `sync`, and
   * a visitor may keep the timeline alive on an interval; without it the
   * timeline refreshes by `fetch` alone.
   */
  refresh?: (
    params: RefreshParams,
    service: Service<T>,
  ) => RefreshResult<T> | Promise<RefreshResult<T>>;
  /** The clock `today` is read from. */
  now?: () => Date;
};

/**
 * The events of a timeline service, keyed by name.
 *
 * - `change`: a field of the container was written.
 * - `loaded`: a fetch settled, success or failure, a result was loaded, or
 *   a refresh landed records.
 * - `appended`: a further batch joined the records.
 * - `selected`: the selected record changed.
 * - `filtered`: the query's clauses changed.
 * - `restored`: a snapshot replaced the arrangement.
 */
export type Events<T extends RecordData> = ChangeEvents<State<T>> & {
  loaded: [event: { id: string; count: number; more: boolean }];
  appended: [
    event: { id: string; count: number; added: number; more: boolean },
  ];
  selected: [event: { id: string; key: string | null }];
  filtered: [event: { id: string; query: string; filters: Filter[] }];
  restored: [event: { id: string; snapshot: Snapshot }];
};

export type Event<T extends RecordData> = keyof Events<T>;

export type Listener<T extends RecordData, E extends Event<T>> = KitListener<
  Events<T>,
  E
>;

/**
 * The timeline machine: records in the order of their time, loaded a
 * batch at a time, in the groups a view draws.
 */
export type Service<T extends RecordData> = {
  readonly id: string;
  readonly config: Config<T>;
  readonly context: Context;
  readonly order: Order;
  readonly grouping: Grouping;
  readonly limit: number;
  readonly searchable: boolean;

  /**
   * The sync machine, where the actions name a `refresh`: the interval a
   * visitor keeps the timeline alive on. It polls the refresh with the
   * mark of the records held, and every load marks it anew. `undefined`
   * without a refresh.
   */
  readonly sync: Sync | undefined;

  /**
   * The query machine over the config's fields. A change to its clauses
   * fetches the records anew, from the first batch.
   */
  readonly query: Query;

  /** The records loaded so far, in the order the timeline runs. */
  readonly records: T[];
  /**
   * The records in their groups, each a run that shares a day, a month,
   * or a year of the config's zone. Read from the records on read, and
   * kept until they change.
   */
  readonly groups: Group<T>[];
  /** Whether a batch follows the records held. */
  readonly more: boolean;
  readonly loading: boolean;
  readonly appending: boolean;
  readonly initialized: boolean;
  readonly selected: string | null;
  /** Today, `YYYY-MM-DD`, as the day reads in the config's time zone. */
  readonly today: string;

  /** A record's key, as text. */
  keyOf(record: T): string;
  /** A record's time, or `null` where its property does not read as one. */
  timeOf(record: T): Date | null;
  /** A record's name: its `label` property as text, or its key. */
  labelOf(record: T): string;
  /** The record held under a key. */
  record(key: string): T | undefined;

  /** Fetches the first batch once, where the container holds none. */
  init(): Promise<boolean>;
  /** Fetches the records anew, from the first batch. */
  fetch(): Promise<void>;
  /**
   * Fetches the batch after the records held and adds it to them. Nothing
   * where there is none, before the first fetch, or while a fetch or
   * another batch is out. One that comes back after the records were
   * fetched anew is dropped.
   */
  loadMore(): Promise<void>;
  /** Replaces the records with a result, with no fetch. */
  load(result: FetchResult<T>): void;

  select(key: string | null): void;

  /**
   * The arrangement as it stands. Each member is the container's own, so
   * a read inside a reactive scope tracks it.
   */
  snapshot(): Snapshot;
  /**
   * Puts an arrangement in place: the query's clauses and the sync's
   * interval, in one fetch. Before `init` it fetches nothing: the first
   * fetch reads what it left. A clause the query rejects is left out, and
   * `snapshot` then differs from what was restored.
   */
  restore(snapshot: Snapshot): void;

  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void;
};
