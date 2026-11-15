import type {
  Actions,
  Config,
  Event,
  Events,
  Listener,
  BulkAction,
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
import type { Emitter } from "@zoobzio/kit";
import type { Updater } from "@tanstack/table-core";

import { entries } from "objectively";
import { constructTable, functionalUpdate } from "@tanstack/table-core";
import { QueryService } from "@zoobzio/query";
import { makeEmitter, makeProxy } from "@zoobzio/kit";
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
 * refetches, and a change of the query's entries refetches from the first
 * page. `on` subscribes.
 */
export class TableService<T extends RowData> implements Service<T> {
  readonly table: TableInstance<T>;
  readonly query: Query;

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
      initialEntries: _e,
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
      columnVisibility: this.state.columnVisibility,
      columnSizing: this.state.columnSizing,
      pageSize: this.state.pagination.pageSize,
      entries: this.state.entries,
    };
  }

  /**
   * The slices are written to the container, past the table's atoms, so
   * none of them fetches on its own.
   */
  restore(snapshot: Snapshot): void {
    this.state.sorting = snapshot.sorting;
    this.state.columnOrder = snapshot.columnOrder;
    this.state.columnVisibility = snapshot.columnVisibility;
    this.state.columnSizing = snapshot.columnSizing;
    this.state.pagination = { pageIndex: 0, pageSize: snapshot.pageSize };
    this.restoring = true;
    try {
      this.query.replace(snapshot.entries);
    } finally {
      this.restoring = false;
    }
    if (this.initialized) void this.fetch();
    this.emitter.emit("restored", { id: this.id, snapshot: this.snapshot() });
  }

  // --- loading ---------------------------------------------------------

  async init(): Promise<boolean> {
    if (this.initialized) return true;
    this.state.initialized = true;
    await this.fetch();
    return true;
  }

  async fetch(): Promise<void> {
    this.state.loading = true;
    try {
      const result = await this.wiring.fetch(
        {
          pagination: this.state.pagination,
          sorting: this.state.sorting,
          query: this.query.text,
          filters: this.query.filters,
        },
        this,
      );
      this.state.data = result.data;
      this.state.rowCount = result.rowCount;
    } finally {
      this.state.loading = false;
      this.emitter.emit("updated", { id: this.id, rowCount: this.rowCount });
    }
  }
}

/** Whether a write to a slice leaves it as it was, member for member. */
const same = (before: unknown, after: unknown): boolean =>
  before === after || JSON.stringify(before) === JSON.stringify(after);
