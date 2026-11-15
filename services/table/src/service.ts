import type {
  Actions,
  Config,
  Event,
  Events,
  Listener,
  Options,
  RowData,
  Service,
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
  readonly actions: Service<T>["actions"];
  readonly bulkActions: Service<T>["bulkActions"];

  private readonly state: State<T>;
  private readonly emitter: Emitter<Events<T>> = makeEmitter();

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
      searchable: _s,
      literals,
      initialEntries: _e,
      locale: _l,
      currency: _c,
      timeZone: _z,
      ...table
    } = config;

    this.actions = entries(actions ?? {}).map(([key, descriptor]) => ({
      ...descriptor,
      key,
      action: (row: T) => this.runAction(key, row),
    }));
    this.bulkActions = entries(bulkActions ?? {}).map(([key, descriptor]) => ({
      ...descriptor,
      key,
      action: (selected: string[]) => wiring.bulkActions?.[key]?.(selected),
    }));

    this.table = constructTable({
      enableRowSelection: this.bulkActions.length > 0,
      ...table,
      features,
      data: this.state.data,
      rowCount: this.state.rowCount,
      manualPagination: true,
      manualSorting: true,
      atoms: {
        pagination: this.slice("pagination", true),
        sorting: this.slice("sorting", true),
        rowSelection: this.slice("rowSelection"),
        columnOrder: this.slice("columnOrder"),
        columnVisibility: this.slice("columnVisibility"),
        columnSizing: this.slice("columnSizing"),
      } satisfies Record<keyof typeof TABLE_SLICES, unknown>,
    });
    // The table takes its options once, by value. The page and its count
    // are the container's, so the two options read it on every access.
    Object.defineProperties(this.table.options, {
      data: { get: () => this.state.data, enumerable: true },
      rowCount: { get: () => this.state.rowCount, enumerable: true },
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
   * a slice the fetch is handed refetches, unless it changes nothing.
   */
  private slice<K extends keyof TableSlices>(
    key: K,
    refetch = false,
  ): SliceAtom<TableSlices[K]> {
    const state: TableSlices = this.state;
    return {
      get: () => state[key],
      set: (updater: Updater<TableSlices[K]>) => {
        const before = state[key];
        const after = functionalUpdate(updater, before);
        if (refetch && same(before, after)) return;
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
  get searchable(): boolean {
    return this.config.searchable ?? true;
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

  // --- actions ---------------------------------------------------------

  runAction(key: string, row: T): void {
    this.wiring.actions?.[key]?.(row);
  }

  runBulkAction(key: string): void {
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
    void this.fetch();
    this.emitter.emit("filtered", {
      id: this.id,
      query: this.query.text,
      filters: this.query.filters,
    });
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
