import type { Features } from "./features";
import type {
  Clause,
  Filter,
  Literal,
  Service as Query,
  Suggest,
  Values,
} from "@zoobzio/query";
import type {
  Config as SyncConfig,
  Service as Sync,
  State as SyncState,
} from "@zoobzio/sync";
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
/**
 * The slices the container holds: the table's state but `columnResizing`,
 * the progress of a resize through TanStack's own handler, which stays
 * with the table.
 */
export type TableSlices = Omit<TableState<Features>, "columnResizing">;

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
 * the page's size without its index, `clauses` the query's, and `interval`
 * the sync's. The page,
 * the selection, and the draft are not part of it. Plain data, so it
 * survives JSON.
 */
export interface Snapshot {
  sorting: TableSlices["sorting"];
  columnOrder: TableSlices["columnOrder"];
  columnPinning: TableSlices["columnPinning"];
  columnVisibility: TableSlices["columnVisibility"];
  columnSizing: TableSlices["columnSizing"];
  pageSize: number;
  clauses: Clause[];
  interval: number;
}

/**
 * One page of rows, and the count of every row the search leaves. `since`
 * is the mark the page is whole as of, what the next refresh is asked for
 * changes since: the server's own reading of its clock, say. Without it
 * the mark is the visitor's clock as the request was made.
 */
export interface FetchResult<T extends RowData> {
  data: T[];
  rowCount: number;
  since?: string;
}

/**
 * What the refresh is handed: what the fetch is, and `since`, the mark of
 * the page the table holds.
 */
export interface RefreshParams extends FetchParams {
  since: string;
}

/**
 * What a refresh answers. Nothing, or `false`: nothing changed, and the
 * table keeps its page. `true`: something did, and the table fetches the
 * page again itself. A result: the page as it now stands, landed as a
 * fetch's is.
 */
export type RefreshResult<T extends RowData> =
  | FetchResult<T>
  | boolean
  | null
  | undefined
  | void;

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
 * The TanStack Table options the `permissions` answer for: the table-wide
 * switches of its features. A column's own (`enableSorting`,
 * `enableHiding`, `enableResizing`, `enablePinning` on its definition) stay
 * the column's.
 */
type Gated =
  | "enableSorting"
  | "enableMultiSort"
  | "enableHiding"
  | "enableColumnResizing"
  | "enableColumnPinning"
  | "enableRowSelection";

/**
 * Something a visitor may do with the table.
 *
 * - `search`: use the toolbar search. A view renders none without it; the
 *   query stays live for imperative use.
 * - `sort`: sort by a column.
 * - `multiSort`: add a column to the sorts.
 * - `select`: select rows. Rows select only where the config also names
 *   bulk actions and `bulkActions` is granted.
 * - `actions`: run a row action. Without it the service has none.
 * - `bulkActions`: run a bulk action. Without it the service has none.
 * - `hide`: show and hide columns.
 * - `reorder`: move a column.
 * - `resize`: resize a column.
 * - `pin`: pin a column to the start or the end of the table, and unpin it.
 * - `pageSize`: change the size of the page.
 * - `refresh`: refetch from the toolbar. `fetch()` itself always fetches.
 */
export type Permission =
  | "search"
  | "sort"
  | "multiSort"
  | "select"
  | "actions"
  | "bulkActions"
  | "hide"
  | "reorder"
  | "resize"
  | "pin"
  | "pageSize"
  | "refresh";

/**
 * The one gate over what a visitor may do: a boolean per permission and
 * nothing else, so the answers of any permission model drop straight in.
 * `true` grants, `false` takes away, and one left out is as
 * `TABLE_DEFAULT_PERMISSIONS` says.
 */
export type Permissions = Partial<Record<Permission, boolean>>;

/**
 * Config the consumer provides: the options of the TanStack table, as it
 * takes them (`columns`, `getRowId`, `initialState`, `defaultColumn`, any
 * other but the ones the service owns or its `permissions` answer for),
 * beside the service's own.
 */
export type Config<T extends RowData> = Omit<
  TableOptions<Features, T>,
  Owned | Gated
> & {
  actions?: Record<string, ActionDescriptor>;
  bulkActions?: Record<string, ActionDescriptor>;
  /**
   * What a visitor may do. The service reads the record on every check
   * and never copies it, so a reactive one, or one whose members are
   * getters, is followed as it changes.
   */
  permissions?: Permissions;
  /**
   * Which rows select, where rows select at all: `permissions.select`
   * and the bulk actions decide that. Defaults to every row.
   */
  enableRowSelection?: (row: TableRow<T>) => boolean;
  /**
   * The literals of the query, handed to it as given. Defaults to the
   * query's, the text literal alone; the table reads the `text` literal as
   * the fetch's `query`.
   */
  literals?: Record<string, Literal>;
  /** The clauses the query starts from. */
  initialClauses?: Clause[];
  /**
   * The sync's config, handed to it as given: the intervals a visitor may
   * pick from, and the one the table starts on. Read only where the wiring
   * names a `refresh`.
   */
  sync?: SyncConfig;
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
 * TanStack table under their own names, the fetched page, the query's
 * slice, and the sync's. The container can be a plain object or a reactive
 * proxy. Each member is replaced as a whole, so a proxy tracks every
 * change.
 */
export type State<T extends RowData> = TableSlices &
  SyncState & {
    data: T[];
    rowCount: number;
    loading: boolean;
    initialized: boolean;
    clauses: Clause[];
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
  /**
   * The poll of the table's sync: asked what changed since the page the
   * table holds was read. With it the table has a `sync`, and a visitor
   * may keep the page alive on an interval; without it the table
   * refreshes by `fetch` alone.
   */
  refresh?: (
    params: RefreshParams,
    service: Service<T>,
  ) => RefreshResult<T> | Promise<RefreshResult<T>>;
  actions?: Record<string, (row: T) => void>;
  bulkActions?: Record<string, (selected: string[]) => void>;
};

/**
 * The events of a table service, keyed by name. Each value is the argument
 * list of a listener. The service emits after the write lands, so a listener
 * reads the new state.
 *
 * - `change`: any field of the container was written.
 * - `updated`: a fetch settled, success or failure, or a refresh landed a
 *   page.
 * - `filtered`: the query's clauses changed.
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
   * clauses refetches from the first page.
   */
  readonly query: Query;

  /**
   * The sync machine, where the wiring names a `refresh`: the interval a
   * visitor keeps the page alive on. It polls the refresh with the mark of
   * the page held, and every page that lands marks it anew. `undefined`
   * without a refresh.
   */
  readonly sync: Sync | undefined;

  /** The row actions; none without the `actions` permission. */
  readonly actions: RowAction<T>[];
  /** The bulk actions; none without the `bulkActions` permission. */
  readonly bulkActions: BulkAction[];
  readonly locale: string;
  readonly currency: string;
  readonly timeZone: string;

  readonly data: T[];
  readonly rowCount: number;
  readonly loading: boolean;
  readonly initialized: boolean;

  /**
   * Whether a permission is granted: as the config's `permissions` say,
   * or its default. The table's own answers follow it
   * (`column.getCanSort()`, `getCanHide()`, `getCanResize()`,
   * `getCanPin()`, `row.getCanSelect()`), and a write of the column order or the page
   * size through the table is dropped without its permission.
   */
  can(permission: Permission): boolean;

  /** Runs a row action; nothing without the `actions` permission. */
  runAction(key: string, row: T): void;
  /** Runs a bulk action; nothing without the `bulkActions` permission. */
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
   * query's clauses, from the first page, in one fetch. Before `init` it
   * fetches nothing: the first fetch reads what it left. The clauses go
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
