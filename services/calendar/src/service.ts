import type {
  Actions,
  Config,
  Context,
  Day,
  Event,
  Events,
  FetchParams,
  Listener,
  Options,
  Scope,
  Service,
  Snapshot,
  State,
  View,
} from "./types";
import type { Found, JSCalendar, Occurrence, Range } from "@zoobzio/time";
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
  copy,
  expand,
  local,
  merge,
  normal,
  overrides,
  patch,
  recurs,
  ruleOf,
  shift,
  stamp,
  zoned,
} from "@zoobzio/time";
import { day, dayOf, daysOf, rangeOf, step } from "./time";

declare const crypto: { randomUUID(): string };

type Entry = JSCalendar.Entry;
type LocalDateTime = JSCalendar.LocalDateTime;
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
    await this.commit("all", [...this.entries, entry], [entry], []);
  }

  async update(
    key: string,
    changes: PatchObject,
    scope?: Scope,
  ): Promise<void> {
    const { source, index, id, reach } = this.target(key, scope);
    if (reach === "one" && id !== undefined) {
      if (!overrides(changes) || "excluded" in changes) {
        throw new Error(`A patch of one occurrence cannot change its entry`);
      }
      const next = this.override(source, id, (held) => merge(held, changes));
      await this.commit(reach, this.replaced(index, [next]), [next], []);
      return;
    }
    if (reach === "following" && id !== undefined) {
      const [head, tail] = this.split(source, id);
      const next = patch(tail, changes);
      // The overrides were keyed to the old start; a new start leaves them
      // naming occurrences the rule no longer gives.
      if ("start" in changes) delete next.recurrenceOverrides;
      await this.commit(
        reach,
        this.replaced(index, [head, next]),
        [head, next],
        [],
      );
      return;
    }
    const next = this.touch(patch(source, changes));
    await this.commit("all", this.replaced(index, [next]), [next], []);
  }

  async remove(key: string, scope?: Scope): Promise<void> {
    const { source, index, id, reach } = this.target(key, scope);
    if (reach === "one" && id !== undefined) {
      const next = this.override(source, id, () => ({ excluded: true }));
      await this.commit(reach, this.replaced(index, [next]), [next], []);
      return;
    }
    if (reach === "following" && id !== undefined) {
      const [head] = this.split(source, id);
      delete head.relatedTo;
      if (source.relatedTo) head.relatedTo = copy(source.relatedTo);
      await this.commit(reach, this.replaced(index, [head]), [head], []);
      return;
    }
    await this.commit("all", this.replaced(index, []), [], [source]);
  }

  /**
   * The entry a command reaches through an occurrence, and how far. An
   * entry that does not recur is reached whole. A recurring one is reached
   * at the one occurrence unless the scope says otherwise; `following`
   * from its first occurrence is the whole entry, and an entry with no
   * rule has no later occurrences to follow, so it is the one.
   */
  private target(
    key: string,
    scope?: Scope,
  ): { source: Entry; index: number; id?: LocalDateTime; reach: Scope } {
    const hit = this.expanded().found.find((f) => f.occurrence.key === key);
    const source = hit === undefined ? undefined : this.entries[hit.source];
    if (hit === undefined || source === undefined) {
      throw new Error(`No occurrence "${key}" in the range`);
    }
    const index = hit.source;
    const id = hit.occurrence.recurrenceId;
    if (!recurs(source) || id === undefined || source.start === undefined) {
      return { source, index, reach: "all" };
    }
    let reach = scope ?? "one";
    if (reach === "following") {
      if (source.recurrenceRule === undefined) reach = "one";
      else if (id <= normal(source.start)) reach = "all";
    }
    return { source, index, id, reach };
  }

  /** The entries with the one at an index replaced by others, or by none. */
  private replaced(index: number, by: Entry[]): Entry[] {
    const entries = this.entries;
    return [...entries.slice(0, index), ...by, ...entries.slice(index + 1)];
  }

  /** An entry as changed now: its `updated` and its `sequence` moved on. */
  private touch<T extends Entry>(entry: T): T {
    return {
      ...entry,
      updated: stamp(this.now()),
      sequence: (entry.sequence ?? 0) + 1,
    };
  }

  /** An entry with the override of one occurrence rewritten. */
  private override(
    source: Entry,
    id: LocalDateTime,
    write: (held: PatchObject) => PatchObject,
  ): Entry {
    const next = copy(source);
    const held = next.recurrenceOverrides ?? {};
    const at = Object.keys(held).find((k) => normal(k) === id) ?? id;
    next.recurrenceOverrides = { ...held, [at]: write(held[at] ?? {}) };
    return this.touch(next);
  }

  /**
   * Cuts a recurring entry in two at an occurrence, as JSCalendar makes a
   * change to this and every later occurrence: the entry, its rule ending
   * at the occurrence before, and a new entry that starts at the
   * occurrence and carries the rule on. Each names the other in
   * `relatedTo`, the first as `next` and the second as `first`, and each
   * keeps the overrides of its own side.
   */
  private split(source: Entry, id: LocalDateTime): [Entry, Entry] {
    const head = copy(source);
    const tail = copy(source);
    const rule = source.recurrenceRule;
    const from = source.start;
    if (rule === undefined || from === undefined) {
      throw new Error(`Entry "${source.uid}" has no rule to cut`);
    }
    const zone = source.timeZone ?? this.context.timeZone;
    const at = zoned(id, zone);
    const run = ruleOf(rule, zoned(from, zone));
    const last = run.previous(at, false);
    const { count, ...open } = copy(rule);

    head.recurrenceRule = {
      ...open,
      until: last === null ? normal(from) : local(last),
    };
    tail.recurrenceRule =
      count === undefined
        ? { ...open }
        : {
            ...open,
            count: Math.max(
              1,
              count - run.all((occurrence) => local(occurrence) < id).length,
            ),
          };

    const held = Object.entries(source.recurrenceOverrides ?? {});
    const before = held.filter(([k]) => normal(k) < id);
    const after = held.filter(([k]) => normal(k) >= id);
    delete head.recurrenceOverrides;
    delete tail.recurrenceOverrides;
    if (before.length)
      head.recurrenceOverrides = copy(Object.fromEntries(before));
    if (after.length)
      tail.recurrenceOverrides = copy(Object.fromEntries(after));

    const uid = this.actions.uid?.() ?? crypto.randomUUID();
    const first =
      Object.entries(source.relatedTo ?? {}).find(
        ([, relation]) => relation.relation?.first === true,
      )?.[0] ?? source.uid;
    head.relatedTo = {
      ...head.relatedTo,
      [uid]: { relation: { next: true } },
    };
    tail.relatedTo = { [first]: { relation: { first: true } } };
    tail.uid = uid;
    tail.start = id;
    if (tail["@type"] === "Task" && tail.due !== undefined) {
      tail.due = shift(tail.due, from, id);
    }
    delete tail.sequence;
    return [this.touch(head), { ...tail, updated: stamp(this.now()) }];
  }

  /**
   * Applies a change to the entries and persists it. The entries change
   * at once; a save that rejects puts them back, unless they have changed
   * again since, and the rejection reaches the caller. `changed` is
   * emitted once the change stands.
   */
  private async commit(
    scope: Scope,
    entries: Entry[],
    stored: Entry[],
    removed: Entry[],
  ): Promise<void> {
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
