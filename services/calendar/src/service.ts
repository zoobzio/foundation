import type {
  Actions,
  Config,
  Context,
  Event,
  Events,
  FetchParams,
  Listener,
  Options,
  Service,
  Snapshot,
  State,
  View,
} from "./types";
import type {
  Day,
  Edit,
  Editing,
  Found,
  JSCalendar,
  Occurrence,
  Range,
  Scope,
} from "@zoobzio/time";
import type { Service as Query } from "@zoobzio/query";
import type { Service as Sync } from "@zoobzio/sync";
import type { Emitter, Loader } from "@zoobzio/kit";

import { QueryService } from "@zoobzio/query";
import { SyncService } from "@zoobzio/sync";
import { makeEmitter, makeLoader, makeProxy } from "@zoobzio/kit";
import {
  CALENDAR_DEFAULT_FIRST_DAY_OF_WEEK,
  CALENDAR_DEFAULT_LOCALE,
  CALENDAR_DEFAULT_TIME_ZONE,
  CALENDAR_STATE_FIELDS,
  CALENDAR_VIEWS,
} from "./constants";
import {
  createEntry,
  day,
  dayOf,
  expand,
  removeEntry,
  updateEntry,
} from "@zoobzio/time";
import { daysOf, rangeOf, step } from "./time";

declare const crypto: { randomUUID(): string };

type Entry = JSCalendar.Entry;
type PatchObject = JSCalendar.PatchObject;
type Weekday = JSCalendar.Weekday;

/** The occurrences read last, and what they were read from. */
type Read = {
  revision: number;
  entries: Entry[];
  range: Range;
  found: Found[];
  occurrences: Occurrence[];
};

/**
 * The headless calendar machine. Owns the view, the date it is anchored
 * on, the range they span, the entries the range loaded, the occurrences
 * the entries recur into, and the query over the config's fields;
 * delegates data loading to
 * `actions.fetch`, persistence to `actions.save`, and the entries' form to
 * the reader and the writer. The entries are JSCalendar: the service reads
 * what schedules one and carries the rest as it found it.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container can be a plain object or a reactive proxy; the
 * service replaces each member as a whole. Each write emits `change`, and
 * the domain methods emit `navigated`, `loaded`, `changed`, `selected`,
 * `filtered`, and `restored`. A move of the view or the date refetches,
 * and so does a change of the query's clauses. `on` subscribes.
 */
export class CalendarService<I, O> implements Service<I, O> {
  public readonly config: Config;
  public readonly context: Context;
  public readonly views: View[];
  public readonly query: Query;
  public readonly sync: Sync | undefined;

  private readonly state: State;
  private readonly emitter: Emitter<Events<O>> = makeEmitter();
  private readonly firstDayOfWeek: Weekday;
  /**
   * The order between the fetches, the loads, and the sync's refreshes. A
   * refresh is quiet, asks nothing while a save is out, and is dropped
   * where the calendar has moved on since it was asked (a fetch began,
   * the entries changed, a save is out): what the visitor did is the
   * newer word.
   */
  private readonly loader: Loader<I>;
  /** How many saves are out: a refresh lands nothing over one. */
  private saving = 0;
  private read: Read | null = null;
  /**
   * Set while a snapshot is restored: the restore fetches once itself, so
   * the query it replaces on the way does not fetch a second time.
   */
  private restoring = false;

  constructor(
    public readonly id: string,
    config: Config,
    state: State,
    private readonly actions: Actions<I, O>,
    options: Options = {},
  ) {
    this.config = Object.freeze({ ...config });
    this.state = makeProxy(state, CALENDAR_STATE_FIELDS, options, this.emitter);
    this.views = config.views ?? CALENDAR_VIEWS;
    this.firstDayOfWeek =
      config.firstDayOfWeek ?? CALENDAR_DEFAULT_FIRST_DAY_OF_WEEK;
    this.context = {
      timeZone: config.timeZone ?? CALENDAR_DEFAULT_TIME_ZONE,
      locale: config.locale ?? CALENDAR_DEFAULT_LOCALE,
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
    this.loader = makeLoader<FetchParams, I>(this.state, {
      params: () => this.params(),
      fetch: (params) => actions.fetch(params, this),
      ...(refresh && {
        refresh: (params, since) => refresh({ ...params, since }, this),
      }),
      land: (source, at) => this.land(source, at),
      settled: ({ range }) =>
        this.emitter.emit("loaded", {
          id: this.id,
          range,
          revision: this.revision,
        }),
      now: () => this.now(),
      busy: () => this.saving > 0,
      version: () => this.revision,
    });

    this.sync = refresh
      ? new SyncService(`${id}-sync`, config.sync ?? {}, this.state, {
          poll: (since) => this.loader.refresh(since),
        })
      : undefined;

    // A non-extensible object is never wrapped by a reactive proxy (Vue
    // skips non-extensible targets), so the occurrences read last stay a
    // plain field however the consumer holds the service: a read that
    // keeps them is not a write a reactive scope sees.
    Object.preventExtensions(this);
  }

  on<E extends Event<O>>(event: E, listener: Listener<O, E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- state -----------------------------------------------------------

  get view(): View {
    return this.state.view;
  }
  get date(): Day {
    return this.state.date;
  }
  get entries(): Entry[] {
    return this.state.entries;
  }
  get loading(): boolean {
    return this.state.loading;
  }
  get initialized(): boolean {
    return this.state.initialized;
  }
  get revision(): number {
    return this.state.revision;
  }
  get selected(): string | null {
    return this.state.selected;
  }
  get searchable(): boolean {
    const { searchable, fields, literals } = this.config;
    return searchable ?? (fields !== undefined || literals !== undefined);
  }

  // --- time ------------------------------------------------------------

  get days(): Day[] {
    return daysOf(this.view, this.date, this.firstDayOfWeek);
  }

  get range(): Range {
    return rangeOf(this.days, this.context.timeZone);
  }

  get today(): Day {
    return dayOf(this.now(), this.context.timeZone);
  }

  private now(): Date {
    return this.actions.now?.() ?? new Date();
  }

  // --- occurrences -----------------------------------------------------

  get occurrences(): Occurrence[] {
    return this.expanded().occurrences;
  }

  get document(): O {
    return this.actions.write(this.entries, this.context);
  }

  occurrence(key: string): Occurrence | undefined {
    return this.occurrences.find((occurrence) => occurrence.key === key);
  }

  occurrencesOn(date: Day): Occurrence[] {
    // Instants to the second in one spelling, so they order as text.
    const { start, end } = rangeOf([date], this.context.timeZone);
    return this.occurrences.filter(
      (occurrence) =>
        occurrence.start < end &&
        (occurrence.end > start || occurrence.start >= start),
    );
  }

  /**
   * The occurrences of the range, read from the entries. The read is tied
   * to the revision, the entries, the view and the date, so a reactive
   * container recomputes it when one moves; while none has, the
   * occurrences read last are returned as they are.
   */
  private expanded(): Read {
    const { revision, entries, range } = this;
    const held = this.read;
    if (
      held !== null &&
      held.revision === revision &&
      held.entries === entries &&
      held.range.start === range.start &&
      held.range.end === range.end
    ) {
      return held;
    }
    const found = expand(entries, range, this.context.timeZone);
    this.read = {
      revision,
      entries,
      range,
      found,
      occurrences: found.map((hit) => hit.occurrence),
    };
    return this.read;
  }

  // --- loading ---------------------------------------------------------

  init(): Promise<boolean> {
    return this.loader.init();
  }

  /**
   * Loads the range through the fetch and the reader. A fetch that
   * settles after a later one began is dropped: the range it loaded is no
   * longer the one shown.
   */
  fetch(): Promise<void> {
    return this.loader.fetch();
  }

  /** What the fetch is handed, as the container stands. */
  private params(): FetchParams {
    return {
      range: this.range,
      query: this.query.text,
      filters: this.query.filters,
    };
  }

  /**
   * Lands a source as the entries, and marks the sync with `at`, the time
   * its request was made, so a change made while the request was out is
   * not passed over.
   */
  private land(source: I, at: string): void {
    this.state.entries = this.actions.read(source, this.context);
    this.state.revision = this.revision + 1;
    this.sync?.mark(at);
  }

  load(source: I): void {
    this.loader.load(source);
  }

  // --- navigation ------------------------------------------------------

  show(view: View): void {
    if (view === this.view || !this.views.includes(view)) return;
    this.state.view = view;
    this.moved();
  }

  go(date: Day): void {
    const next = day(date);
    if (next === this.date) return;
    this.state.date = next;
    this.moved();
  }

  next(): void {
    this.go(step(this.view, this.date, 1));
  }

  prev(): void {
    this.go(step(this.view, this.date, -1));
  }

  private moved(): void {
    this.emitter.emit("navigated", {
      id: this.id,
      view: this.view,
      date: this.date,
      range: this.range,
    });
    this.fetch();
  }

  // --- search ----------------------------------------------------------

  /** The query changed what the entries are: the range is fetched again. */
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
      view: this.state.view,
      clauses: this.state.clauses,
      interval: this.state.interval,
    };
  }

  /**
   * The view is written to the container, past `show`, so it does not
   * fetch on its own; where it moves, `navigated` still follows.
   */
  restore(snapshot: Snapshot): void {
    const moved =
      snapshot.view !== this.view && this.views.includes(snapshot.view);
    if (moved) this.state.view = snapshot.view;
    this.sync?.setInterval(snapshot.interval);
    this.restoring = true;
    try {
      this.query.replace(snapshot.clauses);
    } finally {
      this.restoring = false;
    }
    if (moved) {
      this.emitter.emit("navigated", {
        id: this.id,
        view: this.view,
        date: this.date,
        range: this.range,
      });
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

  // --- commands --------------------------------------------------------

  async create(entry: Entry): Promise<void> {
    await this.commit(createEntry(this.entries, entry));
  }

  async update(
    key: string,
    changes: PatchObject,
    scope?: Scope,
  ): Promise<void> {
    await this.commit(
      updateEntry(
        this.entries,
        this.expanded().found,
        key,
        changes,
        scope,
        this.editing(),
      ),
    );
  }

  async remove(key: string, scope?: Scope): Promise<void> {
    await this.commit(
      removeEntry(
        this.entries,
        this.expanded().found,
        key,
        scope,
        this.editing(),
      ),
    );
  }

  /** What an edit reads of the calendar: its zone, its clock, its uids. */
  private editing(): Editing {
    return {
      zone: this.context.timeZone,
      now: this.now(),
      uid: () => this.actions.uid?.() ?? crypto.randomUUID(),
    };
  }

  /**
   * Applies a change to the entries and persists it. The entries change
   * at once; a save that rejects puts them back, unless they have changed
   * again since, and the rejection reaches the caller. `changed` is
   * emitted once the change stands.
   */
  private async commit({
    scope,
    entries,
    stored,
    removed,
  }: Edit): Promise<void> {
    const before = this.entries;
    this.state.entries = entries;
    this.state.revision = this.revision + 1;
    const applied = this.revision;
    const mutation = {
      scope,
      entries: this.actions.write(stored, this.context),
      removed: this.actions.write(removed, this.context),
    };
    this.saving += 1;
    try {
      await this.actions.save?.(mutation, this);
    } catch (error) {
      if (this.revision === applied) {
        this.state.entries = before;
        this.state.revision = this.revision + 1;
      }
      throw error;
    } finally {
      this.saving -= 1;
    }
    this.emitter.emit("changed", {
      id: this.id,
      revision: this.revision,
      mutation,
    });
  }
}
