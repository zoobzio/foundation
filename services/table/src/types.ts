import type { Features } from "./features";
import type {
  Entry,
  Filter,
  Literal,
  Service as Query,
  Suggest,
  Values,
} from "@zoobzio/query";
import type {
  Change as KitChange,
  Changers as KitChangers,
  Changes as KitChanges,
  Listener as KitListener,
  Middleware as KitMiddleware,
  Options as KitOptions,
  Text,
} from "@zoobzio/kit";
import type {
  Cell,
  CellData,
  Column,
  ColumnDef,
  Header,
  PaginationState,
  Row,
  RowData,
  SortingState,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from "@tanstack/table-core";

/**
 * Column data type: drives how a view renders the column's cells.
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

// What a column carries beyond what TanStack Table reads, on its `meta`.
// The interface is TanStack's, so a layer may widen it further by
// declaration merging (an icon); a property beyond the ones the table and
// its views read is carried onto the column's query field, so the search
// draws the field as the column does.
declare module "@tanstack/table-core" {
  interface ColumnMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
    TValue extends CellData = CellData,
  > {
    /** The column's name, as its header and its query field show it. */
    label?: Text;
    type?: ColumnType;
    align?: "left" | "center" | "right";
    /**
     * Whether the column appears in the search autocomplete. Defaults by
     * type: everything except `action` and `image` is filterable.
     */
    filterable?: boolean;
    /**
     * The operators a filter on the column carries. Without them the column
     * has no operator stage. The table gives an operator no meaning: the
     * consumer reads it from the filters its fetch is handed.
     */
    operators?: readonly string[];
    /**
     * The operator a filter takes when none is given. It must be one of
     * `operators`, or every filter added without an operator is rejected.
     */
    defaultOperator?: string;
    /**
     * The values the search suggests: a list the term narrows, or a
     * provider the term is given to. Without them the value is free entry,
     * except on a `date` or `datetime` column, which suggests the days the
     * query's `dateValues` generates from the term.
     */
    values?: Values;
    /**
     * The route of the column's cells. A cell of the column renders as a
     * link to the route, with the content the cell would otherwise render
     * inside. On a `url` column the route replaces the value's own link.
     */
    link?: (row: TData) => string;
  }
}

/** The TanStack Table types, bound to the features the service registers. */
export type { RowData };
export type TableInstance<T extends RowData> = Table<Features, T>;
export type TableColumnDef<T extends RowData> = ColumnDef<Features, T>;
export type TableColumn<T extends RowData> = Column<Features, T>;
export type TableHeader<T extends RowData> = Header<Features, T>;
export type TableRow<T extends RowData> = Row<Features, T>;
export type TableCell<T extends RowData> = Cell<Features, T>;
export type TableSlices = TableState<Features>;

/**
 * A committed column filter, as the query holds it: `key` is the column's
 * id; `op` is present for a column that declares operators.
 */
export type TableFilter = Filter;

/**
 * The serializable half of a row/bulk action: how it renders. The behavior
 * half is a handler registered under the same key in `Actions`.
 */
export interface ActionDescriptor {
  label: Text;
}

/**
 * Row action: descriptor joined with its handler, under the config key.
 */
export interface RowAction<T extends RowData> extends ActionDescriptor {
  key: string;
  action: (row: T) => void;
}

/**
 * Bulk action: descriptor joined with its handler, under the config key.
 * The handler is given the ids of the selected rows.
 */
export interface BulkAction extends ActionDescriptor {
  key: string;
  action: (selected: string[]) => void;
}

/**
 * What the fetch is handed: the table's `pagination` and `sorting` slices
 * as TanStack Table holds them, and the search: `query` is the committed
 * free text, `filters` the committed column filters.
 */
export interface FetchParams {
  pagination: PaginationState;
  sorting: SortingState;
  query: string;
  filters: TableFilter[];
}

/**
 * The table as a visitor arranged it: the part of the container a saved
 * view holds. The slices are TanStack's, under their names; `pageSize` is
 * the page's size without its index, and `entries` the query's. The page,
 * the selection, and the draft are not part of it. Plain data, so it
 * survives JSON.
 */
export interface Snapshot {
  sorting: TableSlices["sorting"];
  columnOrder: TableSlices["columnOrder"];
  columnVisibility: TableSlices["columnVisibility"];
  columnSizing: TableSlices["columnSizing"];
  pageSize: number;
  entries: Entry[];
}

/** One page of rows, and the count of every row the search leaves. */
export interface FetchResult<T extends RowData> {
  data: T[];
  rowCount: number;
}

/**
 * The TanStack Table options the service sets itself: the state is the
 * container's, the data is the fetch's, and the server sorts and pages.
 */
type Owned =
  | "features"
  | "data"
  | "state"
  | "atoms"
  | "rowCount"
  | "pageCount"
  | "manualPagination"
  | "manualSorting"
  | "mergeOptions";

/**
 * Config the consumer provides: the options of the TanStack table, as it
 * takes them (`columns`, `getRowId`, `initialState`, `defaultColumn`, any
 * other but the ones the service owns), beside the service's own.
 */
export type Config<T extends RowData> = Omit<
  TableOptions<Features, T>,
  Owned
> & {
  actions?: Record<string, ActionDescriptor>;
  bulkActions?: Record<string, ActionDescriptor>;
  /**
   * Whether a UI renders the toolbar search. Defaults to `true`. A hint for
   * the view layer only: the query stays live for imperative use.
   */
  searchable?: boolean;
  /**
   * The literals of the query, handed to it as given. Defaults to the
   * query's, the text literal alone; the table reads the `text` literal as
   * the fetch's `query`.
   */
  literals?: Record<string, Literal>;
  /** The entries the query starts from. */
  initialEntries?: Entry[];
  /** The BCP 47 locale cells format in. Defaults to `en-US`. */
  locale?: string;
  /** The ISO 4217 code currency cells format in. Defaults to `USD`. */
  currency?: string;
  /**
   * The IANA time zone date and datetime cells format in, and the one the
   * day a date column's search suggests first, today, is read in. Defaults
   * to `UTC`, so a server and a browser render the same text.
   */
  timeZone?: string;
};

/**
 * The state container the service reads and writes: the slices of the
 * TanStack table under their own names, the fetched page, and the query's
 * slice. The container can be a plain object or a reactive proxy. Each
 * member is replaced as a whole, so a proxy tracks every change.
 */
export type State<T extends RowData> = TableSlices & {
  data: T[];
  rowCount: number;
  loading: boolean;
  initialized: boolean;
  entries: Entry[];
  draft: string;
  suggest: Suggest;
};

export type StateKey = keyof State<RowData>;

/**
 * The kit's state mechanisms bound to this service's container: per-field
 * middleware, the read/write options, and the change objects.
 */
export type Middleware<T extends RowData> = KitMiddleware<State<T>>;
export type Options<T extends RowData> = KitOptions<State<T>>;
export type Changes<T extends RowData> = KitChanges<State<T>>;
export type Change<
  T extends RowData,
  K extends StateKey = StateKey,
> = KitChange<State<T>, K>;
export type Changers<T extends RowData> = KitChangers<State<T>>;

/**
 * The consumer-supplied behavior: the fetch mechanism plus handlers keyed
 * like the config's descriptor records.
 */
export type Actions<T extends RowData> = {
  fetch: (params: FetchParams, service: Service<T>) => Promise<FetchResult<T>>;
  actions?: Record<string, (row: T) => void>;
  bulkActions?: Record<string, (selected: string[]) => void>;
};

/**
 * The events of a table service, keyed by name. Each value is the argument
 * list of a listener. The service emits after the write lands, so a listener
 * reads the new state.
 *
 * - `change`: any field of the container was written.
 * - `updated`: a fetch settled, success or failure.
 * - `filtered`: the query's entries changed.
 * - `restored`: a snapshot replaced the arrangement.
 */
export type Events<T extends RowData> = {
  change: [change: Change<T>];
  updated: [event: { id: string; rowCount: number }];
  filtered: [event: { id: string; query: string; filters: TableFilter[] }];
  restored: [event: { id: string; snapshot: Snapshot }];
};

export type Event<T extends RowData> = keyof Events<T>;

export type Listener<T extends RowData, E extends Event<T>> = KitListener<
  Events<T>,
  E
>;

export type Service<T extends RowData> = {
  readonly id: string;
  readonly config: Config<T>;

  /**
   * The TanStack table over the container: columns, headers, rows, and
   * the APIs of every registered feature. A write through it lands in the
   * container; a change of `pagination` or `sorting` refetches.
   */
  readonly table: TableInstance<T>;

  /**
   * The query machine over the filterable columns: one field per column,
   * with the operators and values the column declares. A change to its
   * entries refetches from the first page.
   */
  readonly query: Query;

  readonly actions: RowAction<T>[];
  readonly bulkActions: BulkAction[];
  readonly searchable: boolean;
  readonly locale: string;
  readonly currency: string;
  readonly timeZone: string;

  readonly data: T[];
  readonly rowCount: number;
  readonly loading: boolean;
  readonly initialized: boolean;

  runAction(key: string, row: T): void;
  runBulkAction(key: string): void;
  init(): Promise<boolean>;
  fetch(): Promise<void>;

  /**
   * The arrangement as it stands. Each member is the container's own, so
   * a read inside a reactive scope tracks it.
   */
  snapshot(): Snapshot;
  /**
   * Puts an arrangement in place: the slices, the page size, and the
   * query's entries, from the first page, in one fetch. Before `init` it
   * fetches nothing: the first fetch reads what it left. The entries go
   * through the query, so one it rejects is left out and `snapshot` then
   * differs from what was restored.
   */
  restore(snapshot: Snapshot): void;

  /**
   * Subscribes a listener to an event. Listeners run in subscription order.
   * An error in a listener propagates to the caller of the write. Returns a
   * function that removes the listener.
   */
  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void;
};
