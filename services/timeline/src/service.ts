import type {
  Actions,
  Config,
  Context,
  Event,
  Events,
  FetchParams,
  FetchResult,
  Group,
  Grouping,
  Listener,
  Options,
  Order,
  RecordData,
  Service,
  Snapshot,
  State,
} from "./types";
import type { Service as Query } from "@zoobzio/query";
import type { Service as Sync } from "@zoobzio/sync";
import type { Emitter, Loader } from "@zoobzio/kit";

import { QueryService } from "@zoobzio/query";
import { SyncService } from "@zoobzio/sync";
import { makeEmitter, makeLoader, makeProxy } from "@zoobzio/kit";
import {
  TIMELINE_DEFAULT_AT,
  TIMELINE_DEFAULT_GROUP,
  TIMELINE_DEFAULT_KEY,
  TIMELINE_DEFAULT_LIMIT,
  TIMELINE_DEFAULT_LOCALE,
  TIMELINE_DEFAULT_ORDER,
  TIMELINE_DEFAULT_TIME_ZONE,
  TIMELINE_STATE_FIELDS,
} from "./constants";
import { dayOf, groupOf, groupsOf, merge, timeOf } from "./util";

/** The groups read last, and the records they were read from. */
type Read<T extends RecordData> = {
  records: T[];
  groups: Group<T>[];
};

/**
 * The headless timeline machine. Owns the records loaded so far, the
 * cursor of the batch after them, the groups the records fall in, the
 * selection, and the query over the config's fields; delegates data
 * loading to `actions.fetch`. A record is the consumer's own: the service
 * reads its key, its time, and its label by the properties the config
 * names, and carries the rest as it found it.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container can be a plain object or a reactive proxy; the
 * service replaces each member as a whole. Each write emits `change`, and
 * the domain methods emit `loaded`, `appended`, `selected`, `filtered`,
 * and `restored`. A change of the query's clauses fetches the records
 * anew. `on` subscribes.
 */
export class TimelineService<T extends RecordData> implements Service<T> {
  public readonly config: Config<T>;
  public readonly context: Context;
  public readonly order: Order;
  public readonly grouping: Grouping;
  public readonly limit: number;
  public readonly query: Query;
  public readonly sync: Sync | undefined;

  private readonly state: State<T>;
  private readonly emitter: Emitter<Events<T>> = makeEmitter();
  /**
   * The order between the fetches, the loads, and the sync's refreshes. A
   * refresh is quiet, and is dropped where the timeline has moved on
   * since it was asked: what the visitor did is the newer word.
   */
  private readonly loader: Loader<FetchResult<T>>;
  /**
   * Counts the times the records were replaced, or began to be: a further
   * batch that comes back to a later count is of records no longer held.
   */
  private epoch = 0;
  /**
   * Set where the next result to land replaces the records, a fetch's or
   * a load's; one that lands without it is a refresh's, and is laid into
   * the records held.
   */
  private fresh = false;
  private read: Read<T> | null = null;
  /**
   * Set while a snapshot is restored: the restore fetches once itself, so
   * the query it replaces on the way does not fetch a second time.
   */
  private restoring = false;

  constructor(
    public readonly id: string,
    config: Config<T>,
    state: State<T>,
    private readonly actions: Actions<T>,
    options: Options<T> = {},
  ) {
    this.config = Object.freeze({ ...config });
    this.state = makeProxy(state, TIMELINE_STATE_FIELDS, options, this.emitter);
    this.order = config.order ?? TIMELINE_DEFAULT_ORDER;
    this.grouping = config.group ?? TIMELINE_DEFAULT_GROUP;
    this.limit = config.limit ?? TIMELINE_DEFAULT_LIMIT;
    this.context = {
      timeZone: config.timeZone ?? TIMELINE_DEFAULT_TIME_ZONE,
      locale: config.locale ?? TIMELINE_DEFAULT_LOCALE,
    };

    this.query = new QueryService(
      `${id}-query`,
      {
        fields: config.fields ?? {},
        ...(config.literals && { literals: config.literals }),
      },
      this.state,
    );
    this.query.on("changed", () => this.refilter());

    const { refresh } = actions;
    this.loader = makeLoader<FetchParams, FetchResult<T>>(this.state, {
      params: () => this.params(null),
      fetch: (params) => actions.fetch(params, this),
      ...(refresh && {
        refresh: (params, since) => refresh({ ...params, since }, this),
      }),
      land: (result, at) => this.land(result, at),
      settled: () =>
        this.emitter.emit("loaded", {
          id: this.id,
          count: this.records.length,
          more: this.more,
        }),
      now: () => this.now(),
    });

    this.sync = refresh
      ? new SyncService(`${id}-sync`, config.sync ?? {}, this.state, {
          poll: (since) => this.loader.refresh(since),
        })
      : undefined;

    // A non-extensible object is never wrapped by a reactive proxy (Vue
    // skips non-extensible targets), so the groups read last stay a plain
    // field however the consumer holds the service: a read that keeps
    // them is not a write a reactive scope sees.
    Object.preventExtensions(this);
  }

  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- state -----------------------------------------------------------

  get records(): T[] {
    return this.state.records;
  }
  get more(): boolean {
    return this.state.cursor !== null;
  }
  get loading(): boolean {
    return this.state.loading;
  }
  get appending(): boolean {
    return this.state.appending;
  }
  get initialized(): boolean {
    return this.state.initialized;
  }
  get selected(): string | null {
    return this.state.selected;
  }
  get searchable(): boolean {
    const { searchable, fields, literals } = this.config;
    return searchable ?? (fields !== undefined || literals !== undefined);
  }
  get today(): string {
    return dayOf(this.now(), this.context.timeZone);
  }

  private now(): Date {
    return this.actions.now?.() ?? new Date();
  }

  // --- records ---------------------------------------------------------

  keyOf(record: T): string {
    const value: unknown = Reflect.get(
      record,
      this.config.key ?? TIMELINE_DEFAULT_KEY,
    );
    return String(value);
  }

  timeOf(record: T): Date | null {
    return timeOf(Reflect.get(record, this.config.at ?? TIMELINE_DEFAULT_AT));
  }

  labelOf(record: T): string {
    const { label } = this.config;
    const value: unknown =
      label === undefined ? undefined : Reflect.get(record, label);
    return value === undefined || value === null || value === ""
      ? this.keyOf(record)
      : String(value);
  }

  record(key: string): T | undefined {
    return this.records.find((record) => this.keyOf(record) === key);
  }

  /**
   * The groups are read from the records and kept while the records are
   * the ones they were read from: the service replaces the records as a
   * whole, so a reactive container recomputes them on every change.
   */
  get groups(): Group<T>[] {
    const records = this.records;
    if (this.read !== null && this.read.records === records) {
      return this.read.groups;
    }
    const groups = groupsOf(records, (record) =>
      groupOf(this.timeOf(record), this.grouping, this.context.timeZone),
    );
    this.read = { records, groups };
    return groups;
  }

  // --- loading ---------------------------------------------------------

  async init(): Promise<boolean> {
    if (this.initialized) return true;
    const epoch = this.began();
    try {
      return await this.loader.init();
    } finally {
      this.settled(epoch);
    }
  }

  async fetch(): Promise<void> {
    const epoch = this.began();
    try {
      await this.loader.fetch();
    } finally {
      this.settled(epoch);
    }
  }

  load(result: FetchResult<T>): void {
    this.began();
    this.loader.load(result);
  }

  /** The records are about to be replaced: a batch that is out is theirs no more. */
  private began(): number {
    this.epoch += 1;
    this.fresh = true;
    this.state.appending = false;
    return this.epoch;
  }

  /**
   * A fetch settled. One that failed landed nothing, and what lands next
   * is no longer its to replace the records with.
   */
  private settled(epoch: number): void {
    if (epoch === this.epoch) this.fresh = false;
  }

  async loadMore(): Promise<void> {
    const cursor = this.state.cursor;
    if (!this.initialized || this.loading || this.appending || cursor === null)
      return;
    const epoch = this.epoch;
    this.state.appending = true;
    try {
      const result = await this.actions.fetch(this.params(cursor), this);
      if (epoch !== this.epoch) return;
      // One a refresh brought in the meantime is held already.
      const held = new Set(this.records.map((record) => this.keyOf(record)));
      const added = result.data.filter(
        (record) => !held.has(this.keyOf(record)),
      );
      this.state.records = [...this.records, ...added];
      this.state.cursor = result.cursor ?? null;
      this.state.appending = false;
      this.emitter.emit("appended", {
        id: this.id,
        count: this.records.length,
        added: added.length,
        more: this.more,
      });
    } finally {
      if (epoch === this.epoch) this.state.appending = false;
    }
  }

  /** What a fetch is handed, as the container stands, from a cursor. */
  private params(cursor: string | null): FetchParams {
    return {
      cursor,
      limit: this.limit,
      query: this.query.text,
      filters: this.query.filters,
    };
  }

  /**
   * Lands a result, and marks the sync with the mark it names, or with
   * `at`, the time its request was made. A fetch's or a load's replaces
   * the records and the cursor. A refresh's is laid into the records
   * held, and the cursor stays: it is of the first batch again, or of
   * what changed, and what was loaded further down is still held.
   */
  private land(result: FetchResult<T>, at: string): void {
    if (this.fresh) {
      this.fresh = false;
      this.state.records = result.data;
      this.state.cursor = result.cursor ?? null;
    } else {
      this.state.records = merge(
        this.records,
        result.data,
        (record) => this.keyOf(record),
        (record) => this.timeOf(record)?.getTime() ?? 0,
        this.order,
      );
    }
    this.sync?.mark(result.since ?? at);
  }

  // --- search ----------------------------------------------------------

  /** The query changed what the records are: they are fetched anew. */
  private refilter(): void {
    if (!this.restoring) void this.fetch();
    this.emitter.emit("filtered", {
      id: this.id,
      query: this.query.text,
      filters: this.query.filters,
    });
  }

  // --- views -----------------------------------------------------------

  snapshot(): Snapshot {
    return {
      clauses: this.state.clauses,
      interval: this.state.interval,
    };
  }

  restore(snapshot: Snapshot): void {
    this.sync?.setInterval(snapshot.interval);
    this.restoring = true;
    try {
      this.query.replace(snapshot.clauses);
    } finally {
      this.restoring = false;
    }
    if (this.initialized) void this.fetch();
    this.emitter.emit("restored", { id: this.id, snapshot: this.snapshot() });
  }

  // --- selection -------------------------------------------------------

  select(key: string | null): void {
    if (key === this.selected) return;
    this.state.selected = key;
    this.emitter.emit("selected", { id: this.id, key });
  }
}
