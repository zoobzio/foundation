import type {
  Clause,
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
 * A file column — what the browser renders per file row. An interface, so
 * a layer may widen it by declaration merging (an icon); a property beyond
 * the ones the browser and its views read is carried onto the column's
 * query field, so the search draws the field as the column does.
 *
 * A column's query field is what the column declares: `operators`,
 * `defaultOperator`, and `values`. The browser supplies no operators, as
 * it gives an operator no meaning: the consumer reads it from the filters
 * its fetch is handed. It supplies values for a `date` or `datetime`
 * column alone, the days the query's `dateValues` generates from the term
 * in the config's `timeZone`, where the column declares none of its own.
 */
export interface BrowserColumn<T> {
  key: keyof T;
  label: Text;
  type?: ColumnType;
  align?: "left" | "center" | "right";
  /**
   * Whether the files sort by the column. A view lists the sortable
   * columns as its sort options.
   */
  sortable?: boolean;
  sortKey?: string;
  /**
   * Whether the column appears in the search autocomplete. Defaults by
   * type: everything except `action` and `image` is filterable.
   */
  filterable?: boolean;
  /**
   * The operators a filter on the column carries. Without them the column
   * has no operator stage.
   */
  operators?: readonly string[];
  /**
   * The operator a filter takes when none is given. It must be one of
   * `operators`, or every filter added without an operator is rejected.
   */
  defaultOperator?: string;
  /**
   * The values the search suggests: a list the term narrows, or a provider
   * the term is given to, which may ask an API and give its values a page
   * at a time. Without them the value is free entry, except on a `date` or
   * `datetime` column, which suggests the days the query's `dateValues`
   * generates from the term.
   */
  values?: Values;
}

/**
 * A committed column filter, as the query holds it. `op` is present for a
 * column that declares operators.
 */
export type BrowserFilter = Filter;

export type SortDirection = "asc" | "desc";

/**
 * The serializable half of a file/folder/bulk action: how it renders. The
 * behavior half is a handler registered under the same key in `Actions`.
 */
export interface ActionDescriptor {
  label: Text;
}

/**
 * File action — the live shape the service exposes: descriptor joined with
 * its handler, under the config key. `runAction(key, row)` dispatches by
 * key.
 */
export interface FileAction<T> extends ActionDescriptor {
  key: string;
  action: (row: T) => void;
}

/**
 * Bulk action over the selection — the live shape the service exposes:
 * descriptor joined with its handler, under the config key.
 * `runBulkAction(key)` dispatches by key over the service's selection: the
 * selected file keys, then the selected folder keys.
 */
export interface BulkAction extends ActionDescriptor {
  key: string;
  action: (selected: Set<string>, folders: Set<string>) => void;
}

/**
 * A folder row. Its identity is fixed: consumers map their folder data
 * into `key` and `label`, and the label renders in the first column.
 * `values` is what the folder shows in the other columns, keyed and
 * formatted as a file's are (a total under a `filesize` column); a column
 * the folder has no value for is an empty cell. `count` is a badge beside
 * the label. `link` is where the folder lives as a URL: its crumb carries it
 * once the folder is opened, and a view renders that crumb as an anchor.
 */
export type BrowserFolder<T = unknown> = {
  key: string;
  label: string;
  count?: number;
  values?: Partial<T>;
  link?: BrowserLink;
};

/**
 * Where a crumb points as a URL. A view renders a crumb with a link as an
 * anchor and one without as a button.
 */
export type BrowserLink = {
  to: string;
  target?: "_blank" | "_self";
};

/**
 * One step of the navigation trail. State keeps the full crumb (key and
 * label) so breadcrumb labels survive navigation without a refetch; fetch
 * params and events carry keys only. `link` comes from the folder the crumb
 * was opened from, or from `rootLink` for the root crumb.
 */
export type BrowserCrumb = {
  key: string;
  label: Text;
  link?: BrowserLink;
};

/**
 * Parameters passed to the fetch action. The browser owns navigation and
 * the sort: `path` is the folder-key trail from the root (`[]` = root),
 * `sortField` and `sortDirection` the column the listing sorts by. The
 * folders render above the files, each section in the order the fetch
 * returns it, so whether the sort reaches the folders (by their `values`,
 * say) is the fetch's to decide. Its query owns the
 * search: `query` is the committed free text, `filters` the committed
 * column filters. The search is typed in one folder and dropped on leaving
 * it, so a fetch that matches within `path` searches the current folder;
 * how far below `path` it reaches, and whether folders are matched, is the
 * fetch's to decide.
 */
export interface BrowserFetchParams {
  path: string[];
  sortField: string | null;
  sortDirection: SortDirection;
  query: string;
  filters: BrowserFilter[];
}

/**
 * The browser as a visitor arranged it: the part of the container a saved
 * view holds, the sort and the query's clauses. The trail, the listing,
 * the selection, and the draft are not part of it. Plain data, so it
 * survives JSON.
 */
export interface Snapshot {
  sortField: string | null;
  sortDirection: SortDirection;
  clauses: Clause[];
}

export interface BrowserFetchResult<T> {
  folders: BrowserFolder<T>[];
  files: T[];
}

/**
 * Folder action — rendered per-folder in an actions menu. The live shape
 * the service exposes: descriptor joined with its handler, under the config
 * key. `runFolderAction(key, folder)` dispatches by key.
 */
export interface FolderAction<T = unknown> extends ActionDescriptor {
  key: string;
  action: (folder: BrowserFolder<T>) => void;
}

/**
 * Config the consumer provides — pure serializable data. Actions are
 * descriptor records: the key is the action's identity, shared with the
 * handler record in `Actions`. `actions` covers file rows, `folderActions`
 * folder rows, and `bulkActions` the selection, files and folders alike:
 * declaring a bulk action is what makes both selectable.
 */
export type Config<T> = {
  columns: BrowserColumn<T>[];
  fileKey: keyof T;
  /**
   * The label of the root crumb. Defaults to `Home`.
   */
  rootLabel?: Text;
  /**
   * The link of the root crumb. Without it the root crumb has none.
   */
  rootLink?: BrowserLink;
  actions?: Record<string, ActionDescriptor>;
  folderActions?: Record<string, ActionDescriptor>;
  bulkActions?: Record<string, ActionDescriptor>;
  /**
   * Whether a UI renders the toolbar search. Defaults to `true`. A hint for
   * the view layer only — the search surface on the service (`query`, the
   * fetch params) stays live for imperative use.
   */
  searchable?: boolean;
  /**
   * The literals of the query, handed to it as given: the values typed
   * between their own characters, which lead the search's options.
   * Defaults to the query's, the text literal alone, `"text"` under
   * `Search`; the browser reads the `text` literal as the fetch's `query`.
   */
  literals?: Record<string, Literal>;
  /**
   * The BCP 47 locale cells format in. Defaults to `en-US`.
   */
  locale?: string;
  /**
   * The ISO 4217 code currency cells format in. Defaults to `USD`.
   */
  currency?: string;
  /**
   * The IANA time zone date and datetime cells format in, and the one the
   * day a date column's search suggests first, today, is read in. Defaults
   * to `UTC`, so a server and a browser render the same text.
   */
  timeZone?: string;
};

/**
 * The state container the service reads and writes: the listing, the load
 * flags, the trail, the file sort, the selection (file keys in `selected`,
 * folder keys in `selectedFolders`), and the query's slice.
 * The container can be a plain object or a reactive proxy. The service
 * replaces each member as a whole, so a proxy tracks every change.
 * `clauses`, `draft`, and `suggest` belong to the browser's `query`
 * machine, their only writer.
 */
export type State<T> = {
  folders: BrowserFolder<T>[];
  files: T[];
  loading: boolean;
  initialized: boolean;
  path: BrowserCrumb[];
  sortField: string | null;
  sortDirection: SortDirection;
  selected: Set<string>;
  selectedFolders: Set<string>;
  clauses: Clause[];
  draft: string;
  suggest: Suggest;
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
    params: BrowserFetchParams,
    service: Service<T>,
  ) => Promise<BrowserFetchResult<T>>;
  actions?: Record<string, (row: T) => void>;
  folderActions?: Record<string, (folder: BrowserFolder<T>) => void>;
  bulkActions?: Record<
    string,
    (selected: Set<string>, folders: Set<string>) => void
  >;
};

/**
 * The events of a browser service, keyed by name. Each value is the
 * argument list of a listener. The service emits after the write lands, so
 * a listener reads the new state.
 *
 * - `change`: any field of the container was written.
 * - `updated`: a fetch settled, success or failure. `path` is the key trail,
 *   `folders`/`files` the section lengths.
 * - `navigated`: the trail changed through `open` or `navigate`.
 * - `filtered`: the query's clauses changed, by the search or by leaving
 *   the folder it was typed in.
 * - `restored`: a snapshot replaced the arrangement.
 */
export type Events<T> = {
  change: [change: Change<T>];
  updated: [
    event: { id: string; path: string[]; folders: number; files: number },
  ];
  navigated: [event: { id: string; path: string[] }];
  filtered: [event: { id: string; query: string; filters: BrowserFilter[] }];
  restored: [event: { id: string; snapshot: Snapshot }];
};

export type Event<T> = keyof Events<T>;

export type Listener<T, E extends Event<T>> = KitListener<Events<T>, E>;

/**
 * The imperative contract: unwrapped state + derived + the full method
 * surface. `BrowserService<T>` declares `implements` against this, and the
 * fetch action receives it.
 */
export type Service<T> = {
  readonly id: string;
  readonly config: Config<T>;
  readonly columns: BrowserColumn<T>[];
  readonly fileKey: keyof T;
  readonly actions: FileAction<T>[];
  readonly folderActions: FolderAction<T>[];
  readonly bulkActions: BulkAction[];
  readonly rootLabel: Text;
  readonly searchable: boolean;
  readonly locale: string;
  readonly currency: string;
  readonly timeZone: string;

  /**
   * The query machine over the filterable columns: one field per column,
   * with the operators and values the column declares. A change to its
   * clauses refetches the current folder; leaving the folder clears it.
   */
  readonly query: Query;

  readonly folders: BrowserFolder<T>[];
  readonly files: T[];
  readonly loading: boolean;
  readonly initialized: boolean;
  readonly path: BrowserCrumb[];
  readonly sortField: string | null;
  readonly sortDirection: SortDirection;
  /** The keys of the selected files. */
  readonly selected: Set<string>;
  /** The keys of the selected folders. */
  readonly selectedFolders: Set<string>;

  readonly pathKeys: string[];
  readonly depth: number;
  /**
   * The breadcrumb trail: the root crumb, then one crumb per trail step.
   * Each crumb's key is its joined path prefix, unique even when one folder
   * key recurs at several depths; its index is what `navigate` takes.
   */
  readonly trail: BrowserCrumb[];
  readonly filterableColumns: BrowserColumn<T>[];
  /** The columns the files sort by: what a view lists as its sort options. */
  readonly sortableColumns: BrowserColumn<T>[];
  /** Whether the query holds a clause: the listing is a search's result. */
  readonly isFiltered: boolean;
  /** Whether every listed folder and file is selected. */
  readonly isAllSelected: boolean;
  readonly isIndeterminate: boolean;
  readonly selectAllState: boolean | "indeterminate";
  readonly colSpan: number;
  readonly hasSelection: boolean;
  /** How many folders and files are selected. */
  readonly selectionCount: number;
  /**
   * Whether the rows select, folders and files alike: the config declares
   * a bulk action.
   */
  readonly isSelectable: boolean;
  readonly hasActions: boolean;
  readonly hasFolderActions: boolean;
  /**
   * Whether the current folder has settled with neither folders nor files.
   * Gated on `initialized` and `loading`, so a view shows the listing, not
   * the empty state, until the first fetch resolves. Under `isFiltered` it
   * is a search with no match rather than an empty folder.
   */
  readonly isEmpty: boolean;

  open(folder: BrowserFolder<T>): void;
  navigate(index: number): void;
  sortBy(field: string): void;
  sortFieldFor(col: BrowserColumn<T>): string;
  isSorted(col: BrowserColumn<T>): boolean;
  keyOf(row: T): string;
  toggleRow(key: string): void;
  toggleFolder(key: string): void;
  /** Selects every listed folder and file, or none where all are. */
  toggleAll(): void;
  clearSelection(): void;
  isRowSelected(row: T): boolean;
  isFolderSelected(folder: BrowserFolder<T>): boolean;
  runAction(key: string, row: T): void;
  runFolderAction(key: string, folder: BrowserFolder<T>): void;
  runBulkAction(key: string): void;
  init(): Promise<boolean>;
  /**
   * Fetches the current folder. When it settles, the selection keeps only
   * what the new listing still shows, so a bulk action never reaches a row
   * a search or a refresh took out of view.
   */
  fetch(): Promise<void>;

  /**
   * The arrangement as it stands. Each member is the container's own, so
   * a read inside a reactive scope tracks it.
   */
  snapshot(): Snapshot;
  /**
   * Puts an arrangement in place in the folder the browser stands in: the
   * sort and the query's clauses, in one fetch. Before `init` it fetches
   * nothing: the first fetch reads what it left. The clauses go through
   * the query, so one it rejects is left out and `snapshot` then differs
   * from what was restored.
   */
  restore(snapshot: Snapshot): void;

  /**
   * Subscribes a listener to an event. Listeners run in subscription order.
   * An error in a listener propagates to the caller of the write. Returns a
   * function that removes the listener.
   */
  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void;
};
