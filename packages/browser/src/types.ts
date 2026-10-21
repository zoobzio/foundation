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
 * A file column — what the browser renders per file row.
 */
export interface BrowserColumn<T> {
  key: keyof T;
  label: string;
  type?: ColumnType;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sortKey?: string;
  enumValues?: string[];
}

export type SortDirection = "asc" | "desc";

/**
 * The serializable half of a file/folder/bulk action: how it renders. The
 * behavior half is a handler registered under the same key in `Actions`.
 */
export interface ActionDescriptor {
  label: string;
}

/**
 * File action — the live shape the service exposes: descriptor joined with
 * its handler.
 */
export interface FileAction<T> {
  label: string;
  action: (row: T) => void;
}

/**
 * Bulk action over the selected files — the live shape the service exposes:
 * descriptor joined with its handler.
 */
export interface BulkAction {
  label: string;
  action: (selected: Set<string>) => void;
}

/**
 * A folder row — fixed on purpose: consumers map their folder data into it,
 * and folder rendering customizes through the view. Files stay generic;
 * folders do not.
 */
export type BrowserFolder = {
  key: string;
  label: string;
  count?: number;
};

/**
 * One step of the navigation trail. State keeps the full crumb (key and
 * label) so breadcrumb labels survive navigation without a refetch; fetch
 * params and events carry keys only.
 */
export type BrowserCrumb = {
  key: string;
  label: string;
};

/**
 * Parameters passed to the fetch action. The browser owns navigation and
 * file sort: `path` is the folder-key trail from the root (`[]` = root).
 * Sorting applies to files only — folders always render alphabetically,
 * enforced by the service regardless of fetch order.
 */
export interface BrowserFetchParams {
  path: string[];
  sortField: string | null;
  sortDirection: SortDirection;
}

export interface BrowserFetchResult<T> {
  folders: BrowserFolder[];
  files: T[];
}

/**
 * Folder action — rendered per-folder in an actions menu. The live shape
 * the service exposes: descriptor joined with its handler.
 */
export type FolderAction = {
  label: string;
  action: (folder: BrowserFolder) => void;
};

/**
 * Config the consumer provides — pure serializable data. Actions are
 * descriptor records: the key is the action's identity, shared with the
 * handler record in `Actions`. `actions`/`bulkActions` cover files
 * (selection is files-only); `folderActions` covers folder rows.
 */
export type Config<T> = {
  columns: BrowserColumn<T>[];
  fileKey: keyof T;
  rootLabel?: string;
  actions?: Record<string, ActionDescriptor>;
  folderActions?: Record<string, ActionDescriptor>;
  bulkActions?: Record<string, ActionDescriptor>;
};

/**
 * The state container the service reads and writes: the listing, the load
 * flags, the trail, the file sort, and the selection. The container can be
 * a plain object or a reactive proxy. The service replaces each member as a
 * whole, so a proxy tracks every change.
 */
export type State<T> = {
  folders: BrowserFolder[];
  files: T[];
  loading: boolean;
  initialized: boolean;
  path: BrowserCrumb[];
  sortField: string | null;
  sortDirection: SortDirection;
  selected: Set<string>;
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
  folderActions?: Record<string, (folder: BrowserFolder) => void>;
  bulkActions?: Record<string, (selected: Set<string>) => void>;
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
 */
export type Events<T> = {
  change: [change: Change<T>];
  updated: [
    event: { id: string; path: string[]; folders: number; files: number },
  ];
  navigated: [event: { id: string; path: string[] }];
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
  readonly folderActions: FolderAction[];
  readonly bulkActions: BulkAction[];

  readonly folders: BrowserFolder[];
  readonly files: T[];
  readonly loading: boolean;
  readonly initialized: boolean;
  readonly path: BrowserCrumb[];
  readonly sortField: string | null;
  readonly sortDirection: SortDirection;
  readonly selected: Set<string>;

  readonly pathKeys: string[];
  readonly depth: number;
  readonly isAllSelected: boolean;
  readonly isIndeterminate: boolean;
  readonly selectAllState: boolean | "indeterminate";
  readonly colSpan: number;

  open(folder: BrowserFolder): void;
  navigate(index: number): void;
  sortBy(field: string): void;
  sortFieldFor(col: BrowserColumn<T>): string;
  isSorted(col: BrowserColumn<T>): boolean;
  keyOf(row: T): string;
  toggleRow(key: string): void;
  toggleAll(): void;
  clearSelection(): void;
  isRowSelected(row: T): boolean;
  init(): Promise<boolean>;
  fetch(): Promise<void>;

  /**
   * Subscribes a listener to an event. Listeners run in subscription order.
   * An error in a listener propagates to the caller of the write. Returns a
   * function that removes the listener.
   */
  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void;
};
