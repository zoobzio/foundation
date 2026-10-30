import type { Entry, Filter, Service as Query } from "@zoobzio/query";
import type {
  Change as KitChange,
  Changers as KitChangers,
  Changes as KitChanges,
  Listener as KitListener,
  Middleware as KitMiddleware,
  Options as KitOptions,
} from "@zoobzio/kit";

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

/**
 * A table column. An interface, so a layer may widen it by declaration
 * merging (an icon); a property beyond the ones the table reads is carried
 * onto the column's query field, so the search draws the field as the
 * column does.
 */
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
 * A committed column filter, as the query holds it. Keys are strings,
 * matching the `sortField` / `columnOrder` convention; `op` is present for
 * operator columns (date/datetime: before/after/on, number/currency:
 * over/under/is).
 */
export type TableFilter = Filter;

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
 * its handler, under the config key. `runAction(key, row)` dispatches by
 * key.
 */
export interface RowAction<T> extends ActionDescriptor {
  key: string;
  action: (row: T) => void;
}

/**
 * Bulk action — the live shape the service exposes: descriptor joined with
 * its handler, under the config key. `runBulkAction(key)` dispatches by key
 * over the service's selection.
 */
export interface BulkAction extends ActionDescriptor {
  key: string;
  action: (selected: Set<string>) => void;
}

/**
 * Parameters passed to the fetch action. The table owns paging and sort;
 * its query owns the search: `query` is the committed free text, `filters`
 * the committed column filters.
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
  /**
   * The BCP 47 locale cells format in. Defaults to `en-US`.
   */
  locale?: string;
  /**
   * The ISO 4217 code currency cells format in. Defaults to `USD`.
   */
  currency?: string;
  /**
   * The IANA time zone date and datetime cells format in. Defaults to
   * `UTC`, so a server and a browser render the same text.
   */
  timeZone?: string;
};

/**
 * The state container the service reads and writes: paging, sort,
 * selection, column order, and the query's slice. The container can be a
 * plain object or a reactive proxy. The service replaces each member as a
 * whole, so a proxy tracks every change. `entries` and `draft` belong to
 * the table's `query` machine, its only writer.
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
  entries: Entry[];
  draft: string;
};

export type StateKey = keyof State<unknown>;

/**
 * The kit's state mechanisms bound to this service's container: per-field
 * middleware, the read/write options, and the change objects.
 */
export type Middleware<T> = KitMiddleware<State<T>>;
export type Options<T> = KitOptions<State<T>>;
export type Changes<T> = KitChanges<State<T>>;
export type Change<T, K extends StateKey = StateKey> = KitChange<State<T>, K>;
export type Changers<T> = KitChangers<State<T>>;

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
 * The events of a table service, keyed by name. Each value is the argument
 * list of a listener. The service emits after the write lands, so a listener
 * reads the new state.
 *
 * - `change`: any field of the container was written.
 * - `updated`: a fetch settled, success or failure. `total` is the stored total.
 * - `filtered`: the query's entries changed.
 */
export type Events<T> = {
  change: [change: Change<T>];
  updated: [event: { id: string; total: number }];
  filtered: [event: { id: string; query: string; filters: TableFilter[] }];
};

export type Event<T> = keyof Events<T>;

export type Listener<T, E extends Event<T>> = KitListener<Events<T>, E>;

export type Service<T> = {
  readonly id: string;
  readonly config: Config<T>;
  readonly columns: DataTableColumn<T>[];
  readonly rowKey: keyof T;
  readonly actions: RowAction<T>[];
  readonly bulkActions: BulkAction[];
  readonly pinnedColumns: (keyof T)[];
  readonly searchable: boolean;
  readonly locale: string;
  readonly currency: string;
  readonly timeZone: string;

  /**
   * The query machine over the filterable columns: one field per column,
   * with the operators of its type and the values of an enum or boolean
   * column. A change to its entries refetches from the first page.
   */
  readonly query: Query;

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

  readonly visibleColumns: DataTableColumn<T>[];
  readonly filterableColumns: DataTableColumn<T>[];
  readonly isAllSelected: boolean;
  readonly isIndeterminate: boolean;
  readonly selectAllState: boolean | "indeterminate";
  readonly colSpan: number;
  readonly hasSelection: boolean;
  readonly isSelectable: boolean;
  readonly hasActions: boolean;

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
  setVisibleColumns(keys: Iterable<string>): void;
  moveColumn(key: string, toKey: string): void;
  reorderColumns(order: string[]): void;
  resetColumns(): void;
  isColumnPinned(key: keyof T): boolean;
  isColumnVisible(key: keyof T): boolean;
  runAction(key: string, row: T): void;
  runBulkAction(key: string): void;
  init(): Promise<boolean>;
  fetch(): Promise<void>;

  /**
   * Subscribes a listener to an event. Listeners run in subscription order.
   * An error in a listener propagates to the caller of the write. Returns a
   * function that removes the listener.
   */
  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void;
};
