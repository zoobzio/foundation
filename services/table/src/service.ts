import type {
  Actions,
  Config,
  Event,
  Events,
  Listener,
  BulkAction,
  FetchParams,
  FetchResult,
  Options,
  Permission,
  RowAction,
  RowData,
  Service,
  Snapshot,
  State,
  TableInstance,
  TableSlices,
} from "./types";
import type { Service as Query } from "@zoobzio/query";
import type { Service as Sync } from "@zoobzio/sync";
import type { Emitter, Loader } from "@zoobzio/kit";
import type { Updater } from "@tanstack/table-core";

import { entries } from "objectively";
import { constructTable, functionalUpdate } from "@tanstack/table-core";
import { QueryService } from "@zoobzio/query";
import { SyncService } from "@zoobzio/sync";
import { makeEmitter, makeLoader, makeProxy } from "@zoobzio/kit";
import {
  TABLE_DEFAULT_CURRENCY,
  TABLE_DEFAULT_LOCALE,
  TABLE_DEFAULT_PERMISSIONS,
  TABLE_DEFAULT_TIME_ZONE,
  TABLE_SLICES,
  TABLE_STATE_FIELDS,
} from "./constants";
import { features } from "./features";
import { fields } from "./util";

const SUBSCRIPTION = { unsubscribe: () => {} };

/** A writable atom, as TanStack Table takes one for a slice it does not own. */
type SliceAtom<V> = {
  get: () => V;
  set: (updater: Updater<V>) => void;
  subscribe: () => typeof SUBSCRIPTION;
};

/**
 * The headless table machine: a TanStack table over the `state` container,
 * the query over its columns, and the loading of its rows through
 * `wiring.fetch`. The server filters, sorts, and pages; the table holds
 * one page.
 *
 * The container owns every slice of the table's state, under TanStack's
 * names, and is read and written through the `options` middleware. It can
 * be a plain object or a reactive proxy; each member is replaced as a
 * whole. Each write emits `change`; a write of `pagination` or `sorting`
 * refetches, and a change of the query's clauses refetches from the first
 * page. `on` subscribes.
 *
 * Where the wiring names a `refresh`, the table has a sync: it polls the
 * refresh for what changed since the page held was read, on the interval
 * a visitor sets, and every page that lands marks it anew.
 */
export class TableService<T extends RowData> implements Service<T> {
  readonly table: TableInstance<T>;
  readonly query: Query;
  readonly sync: Sync | undefined;

  /** The actions the config names, whatever the permissions say. */
  private readonly named: { rows: RowAction<T>[]; bulk: BulkAction[] };
  /** What a service without a permission has in their place. */
  private readonly none: { rows: RowAction<T>[]; bulk: BulkAction[] } = {
    rows: [],
    bulk: [],
  };

  private readonly state: State<T>;
  private readonly emitter: Emitter<Events<T>> = makeEmitter();
  /**
   * The order between the fetches and the sync's refreshes: a fetch that
   * settles after a later one began is dropped, and a refresh is quiet,
   * and dropped where the table has moved on since it was asked.
   */
  private readonly loader: Loader<FetchResult<T>>;

  /**
   * Set while a snapshot is restored: the restore fetches once itself, so
   * the query it replaces on the way does not fetch a second time.
   */
  private restoring = false;

  constructor(
    public readonly id: string,
    public readonly config: Config<T>,
    state: State<T>,
    private readonly wiring: Actions<T>,
    options: Options<T> = {},
  ) {
    this.state = makeProxy(state, TABLE_STATE_FIELDS, options, this.emitter);

    const {
      actions,
      bulkActions,
      permissions: _p,
      enableRowSelection,
      literals,
      initialClauses: _e,
      sync,
      locale: _l,
      currency: _c,
      timeZone: _z,
      ...table
    } = config;

    this.named = {
      rows: entries(actions ?? {}).map(([key, descriptor]) => ({
        ...descriptor,
        key,
        action: (row: T) => this.runAction(key, row),
      })),
      bulk: entries(bulkActions ?? {}).map(([key, descriptor]) => ({
        ...descriptor,
        key,
        action: (selected: string[]) => {
          if (this.can("bulkActions")) wiring.bulkActions?.[key]?.(selected);
        },
      })),
    };

    this.table = constructTable({
      ...table,
      features,
      data: this.state.data,
      rowCount: this.state.rowCount,
      manualPagination: true,
      manualSorting: true,
      atoms: {
        pagination: this.slice(
          "pagination",
          true,
          (before, after) =>
            before.pageSize === after.pageSize || this.can("pageSize"),
        ),
        sorting: this.slice("sorting", true),
        rowSelection: this.slice("rowSelection"),
        columnOrder: this.slice("columnOrder", false, () =>
          this.can("reorder"),
        ),
        columnPinning: this.slice("columnPinning"),
        columnVisibility: this.slice("columnVisibility"),
        columnSizing: this.slice("columnSizing"),
      } satisfies Record<keyof typeof TABLE_SLICES, unknown>,
    });
    // The table takes its options once, by value. The page and its count
    // are the container's, and the switches of its features the
    // permissions', so each of these options reads its source on every
    // access.
    const gate = (permission: Permission) => ({
      get: () => this.can(permission),
      enumerable: true,
    });
    Object.defineProperties(this.table.options, {
      data: { get: () => this.state.data, enumerable: true },
      rowCount: { get: () => this.state.rowCount, enumerable: true },
      enableSorting: gate("sort"),
      enableMultiSort: gate("multiSort"),
      enableHiding: gate("hide"),
      enableColumnResizing: gate("resize"),
      enableColumnPinning: gate("pin"),
      enableRowSelection: {
        get: () =>
          this.can("select") && this.bulkActions.length > 0
            ? (enableRowSelection ?? true)
            : false,
        enumerable: true,
      },
    });

    this.query = new QueryService(
      `${id}-query`,
      {
        fields: fields(this.table.getAllLeafColumns(), this.timeZone),
        ...(literals && { literals }),
      },
      this.state,
    );
    this.query.on("changed", () => this.refilter());

    const { refresh } = wiring;
    this.loader = makeLoader<FetchParams, FetchResult<T>>(this.state, {
      params: () => this.params(),
      fetch: (params) => wiring.fetch(params, this),
      ...(refresh && {
        refresh: (params, since) => refresh({ ...params, since }, this),
      }),
      land: (result, at) => this.land(result, at),
      settled: () =>
        this.emitter.emit("updated", { id: this.id, rowCount: this.rowCount }),
    });

    this.sync = refresh
      ? new SyncService(`${id}-sync`, sync ?? {}, this.state, {
          poll: (since) => this.loader.refresh(since),
        })
      : undefined;
  }

  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void {
    return this.emitter.on(event, listener);
  }

  /**
   * A slice of the table's state as the atom TanStack Table reads and
   * writes: the container's member, with no value of its own. A write to
   * a slice the fetch is handed refetches, unless it changes nothing. A
   * write the `allowed` guard refuses is dropped.
   */
  private slice<K extends keyof TableSlices>(
    key: K,
    refetch = false,
    allowed?: (before: TableSlices[K], after: TableSlices[K]) => boolean,
  ): SliceAtom<TableSlices[K]> {
    const state: TableSlices = this.state;
    return {
      get: () => state[key],
      set: (updater: Updater<TableSlices[K]>) => {
        const before = state[key];
        const after = functionalUpdate(updater, before);
        if (refetch && same(before, after)) return;
        if (allowed && !allowed(before, after)) return;
        state[key] = after;
        if (refetch) void this.fetch();
      },
      subscribe: () => SUBSCRIPTION,
    };
  }

  // --- state -----------------------------------------------------------

  get data(): T[] {
    return this.state.data;
  }
  get rowCount(): number {
    return this.state.rowCount;
  }
  get loading(): boolean {
    return this.state.loading;
  }
  get initialized(): boolean {
    return this.state.initialized;
  }
  get locale(): string {
    return this.config.locale ?? TABLE_DEFAULT_LOCALE;
  }
  get currency(): string {
    return this.config.currency ?? TABLE_DEFAULT_CURRENCY;
  }
  get timeZone(): string {
    return this.config.timeZone ?? TABLE_DEFAULT_TIME_ZONE;
  }

  // --- permissions -----------------------------------------------------

  can(permission: Permission): boolean {
    return (
      this.config.permissions?.[permission] ??
      TABLE_DEFAULT_PERMISSIONS[permission]
    );
  }

  // --- actions ---------------------------------------------------------

  get actions(): RowAction<T>[] {
    return this.can("actions") ? this.named.rows : this.none.rows;
  }

  get bulkActions(): BulkAction[] {
    return this.can("bulkActions") ? this.named.bulk : this.none.bulk;
  }

  runAction(key: string, row: T): void {
    if (this.can("actions")) this.wiring.actions?.[key]?.(row);
  }

  runBulkAction(key: string): void {
    if (!this.can("bulkActions")) return;
    this.wiring.bulkActions?.[key]?.(this.table.getSelectedRowIds());
  }

  // --- search ----------------------------------------------------------

  /**
   * The query changed what the rows are, so the page the table was on
   * names other rows, or none: back to the first, in the one fetch.
   */
  private refilter(): void {
    if (this.state.pagination.pageIndex !== 0) {
      this.state.pagination = { ...this.state.pagination, pageIndex: 0 };
    }
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
      sorting: this.state.sorting,
      columnOrder: this.state.columnOrder,
      columnPinning: this.state.columnPinning,
      columnVisibility: this.state.columnVisibility,
      columnSizing: this.state.columnSizing,
      pageSize: this.state.pagination.pageSize,
      clauses: this.state.clauses,
      interval: this.state.interval,
    };
  }

  /**
   * The slices are written to the container, past the table's atoms, so
   * none of them fetches on its own.
   */
  restore(snapshot: Snapshot): void {
    this.state.sorting = snapshot.sorting;
    this.state.columnOrder = snapshot.columnOrder;
    this.state.columnPinning = snapshot.columnPinning;
    this.state.columnVisibility = snapshot.columnVisibility;
    this.state.columnSizing = snapshot.columnSizing;
    this.state.pagination = { pageIndex: 0, pageSize: snapshot.pageSize };
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

  // --- loading ---------------------------------------------------------

  init(): Promise<boolean> {
    return this.loader.init();
  }

  fetch(): Promise<void> {
    return this.loader.fetch();
  }

  /** What the fetch is handed, as the container stands. */
  private params(): FetchParams {
    return {
      pagination: this.state.pagination,
      sorting: this.state.sorting,
      query: this.query.text,
      filters: this.query.filters,
    };
  }

  /**
   * Lands a page, and marks the sync with it: the result's own `since`,
   * or `at`, the time its request was made, so a change made while the
   * request was out is not passed over.
   */
  private land(result: FetchResult<T>, at: string): void {
    this.state.data = result.data;
    this.state.rowCount = result.rowCount;
    this.sync?.mark(result.since ?? at);
  }
}

/** Whether a write to a slice leaves it as it was, member for member. */
const same = (before: unknown, after: unknown): boolean =>
  before === after || JSON.stringify(before) === JSON.stringify(after);
