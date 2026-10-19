/**
 * Column data type — drives cell rendering and sort behavior.
 */
export type ColumnType =
  | "text"
  | "number"
  | "date"
  | "datetime"
  | "boolean"
  | "enum"
  | "currency"
  | "filesize"
  | "url"
  | "image"
  | "action";

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  type?: ColumnType;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sortKey?: string;
  enumValues?: string[];
  /**
   * Whether the column appears in the search autocomplete. Defaults by
   * type: everything except `action` and `image` is filterable.
   */
  filterable?: boolean;
}

/**
 * A committed column filter. Keys are strings, matching the `sortField` /
 * `columnOrder` convention; `op` is present for operator-stage columns
 * (date/datetime: before/after/on, number/currency: over/under/is).
 */
export interface TableFilter {
  key: string;
  op?: string;
  value: string;
}

export type SortDirection = "asc" | "desc";

/**
 * The serializable half of a row/bulk action: how it renders. The behavior
 * half is a handler registered under the same key in `Actions`.
 */
export interface ActionDescriptor {
  label: string;
}

/**
 * Row action — the live shape the service exposes: descriptor joined with
 * its handler.
 */
export interface RowAction<T> {
  label: string;
  action: (row: T) => void;
}

/**
 * Bulk action — the live shape the service exposes: descriptor joined with
 * its handler.
 */
export interface BulkAction {
  label: string;
  action: (selected: Set<string>) => void;
}

/**
 * Parameters passed to the fetch action. The table owns paging, sort, and
 * search: `query` is the committed free-text search, `filters` the committed
 * column filters.
 */
export interface DataTableFetchParams {
  page: number;
  pageSize: number;
  sortField: string | null;
  sortDirection: SortDirection;
  query: string;
  filters: TableFilter[];
}

export interface DataTableFetchResult<T> {
  data: T[];
  total: number;
  pageCount: number;
}

/**
 * Config the consumer provides — pure serializable data. Actions are
 * descriptor records: the key is the action's identity, shared with the
 * handler record in `Actions`.
 */
export type Config<T> = {
  columns: DataTableColumn<T>[];
  rowKey: keyof T;
  actions?: Record<string, ActionDescriptor>;
  bulkActions?: Record<string, ActionDescriptor>;
  pinnedColumns?: (keyof T)[];
  defaultColumnOrder?: (keyof T)[];
  /**
   * Whether a UI renders the toolbar search. Defaults to `true`. A hint for
   * the view layer only — the search surface on the service (`query`,
   * `filters`, mutators, fetch params) stays live for imperative use.
   */
  searchable?: boolean;
};

/**
 * The state container the service reads and writes: paging, sort,
 * selection, column order, and the committed search. The container can be a
 * plain object or a reactive proxy. The service replaces each member as a
 * whole, so a proxy tracks every change.
 */
export type State<T> = {
  data: T[];
  loading: boolean;
  initialized: boolean;
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  sortField: string | null;
  sortDirection: SortDirection;
  selected: Set<string>;
  columnOrder: string[];
  query: string;
  filters: TableFilter[];
};

export type StateKey = keyof State<unknown>;

/**
 * One middleware slot per state field. A slot receives the value of its
 * field and returns the value the service uses. A missing slot passes the
 * value on.
 */
export type Middleware<T> = {
  [K in StateKey]?: (value: State<T>[K]) => State<T>[K];
};

/**
 * The middleware for reads and writes of the state container.
 */
export type Options<T> = {
  get?: { state?: Middleware<T> };
  set?: { state?: Middleware<T> };
};

/**
 * The consumer-supplied behavior: the fetch mechanism plus handlers keyed
 * like the config's descriptor records.
 */
export type Actions<T> = {
  fetch: (
    params: DataTableFetchParams,
    service: Service<T>,
  ) => Promise<DataTableFetchResult<T>>;
  actions?: Record<string, (row: T) => void>;
  bulkActions?: Record<string, (selected: Set<string>) => void>;
};

/**
 * The change object of each field: the field name with the stored values
 * around the write, after the `set` middleware.
 */
export type Changes<T> = {
  [K in keyof State<T>]: { field: K; before: State<T>[K]; after: State<T>[K] };
};

/**
 * A write to one field of the container. With no `K`, the union over every
 * field; `field` discriminates.
 */
export type Change<T, K extends StateKey = StateKey> = Changes<T>[K];

/**
 * The change builder of each field. A lookup by a generic key yields the
 * change object of that field, which an object literal cannot express
 * without a cast.
 */
export type Changers<T> = {
  [K in keyof State<T>]: (
    field: K,
    before: State<T>[K],
    after: State<T>[K],
  ) => Changes<T>[K];
};

/**
 * An event map: each key is an event name, each value the argument list of
 * its listeners.
 */
export type EventMap = Record<string, unknown[]>;

/**
 * A typed event bus over an event map.
 */
export type Emitter<M extends EventMap> = {
  /**
   * Subscribes a listener to an event. Returns the function that removes it.
   */
  on: <E extends keyof M>(
    event: E,
    listener: (...args: M[E]) => void,
  ) => () => void;
  /**
   * Calls the listeners of an event, in subscription order, over a copy, so
   * a listener can unsubscribe during the call.
   */
  emit: <E extends keyof M>(event: E, ...args: M[E]) => void;
  /**
   * Whether an event has a listener. Skips the work of an event payload when
   * nothing listens.
   */
  heard: (event: keyof M) => boolean;
};

/**
 * The events of a table service, keyed by name. Each value is the argument
 * list of a listener. The service emits after the write lands, so a listener
 * reads the new state.
 *
 * - `change`: any field of the container was written.
 * - `updated`: a fetch settled, success or failure. `total` is the stored total.
 * - `filtered`: the committed query or filters changed.
 */
export type Events<T> = {
  change: [change: Change<T>];
  updated: [event: { id: string; total: number }];
  filtered: [event: { id: string; query: string; filters: TableFilter[] }];
};

export type Event<T> = keyof Events<T>;

export type Listener<T, E extends Event<T>> = (...args: Events<T>[E]) => void;

export type Listeners<M extends EventMap> = {
  [E in keyof M]?: Set<(...args: M[E]) => void>;
};

export type Service<T> = {
  readonly id: string;
  readonly config: Config<T>;
  readonly columns: DataTableColumn<T>[];
  readonly rowKey: keyof T;
  readonly actions: RowAction<T>[];
  readonly bulkActions: BulkAction[];
  readonly pinnedColumns: (keyof T)[];
  readonly searchable: boolean;

  readonly data: T[];
  readonly loading: boolean;
  readonly initialized: boolean;
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly pageCount: number;
  readonly sortField: string | null;
  readonly sortDirection: SortDirection;
  readonly selected: Set<string>;
  readonly columnOrder: string[];
  readonly query: string;
  readonly filters: TableFilter[];

  readonly visibleColumns: DataTableColumn<T>[];
  readonly filterableColumns: DataTableColumn<T>[];
  readonly isAllSelected: boolean;
  readonly isIndeterminate: boolean;
  readonly selectAllState: boolean | "indeterminate";
  readonly colSpan: number;

  goToPage(page: number): void;
  setPageSize(size: number): void;
  sortBy(field: string): void;
  sortFieldFor(col: DataTableColumn<T>): string;
  isSorted(col: DataTableColumn<T>): boolean;
  keyOf(row: T): string;
  toggleRow(key: string): void;
  toggleAll(): void;
  clearSelection(): void;
  isRowSelected(row: T): boolean;
  toggleColumn(key: keyof T): void;
  reorderColumns(order: string[]): void;
  resetColumns(): void;
  isColumnPinned(key: keyof T): boolean;
  isColumnVisible(key: keyof T): boolean;
  addFilter(key: string, value: string, op?: string): void;
  removeFilter(index: number): void;
  setQuery(value: string): void;
  init(): Promise<boolean>;
  fetch(): Promise<void>;

  /**
   * Subscribes a listener to an event. Listeners run in subscription order.
   * An error in a listener propagates to the caller of the write. Returns a
   * function that removes the listener.
   */
  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void;
};
