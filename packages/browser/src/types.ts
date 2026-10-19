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
    params: BrowserFetchParams,
    service: Service<T>,
  ) => Promise<BrowserFetchResult<T>>;
  actions?: Record<string, (row: T) => void>;
  folderActions?: Record<string, (folder: BrowserFolder) => void>;
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

export type Listener<T, E extends Event<T>> = (...args: Events<T>[E]) => void;

export type Listeners<M extends EventMap> = {
  [E in keyof M]?: Set<(...args: M[E]) => void>;
};

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
