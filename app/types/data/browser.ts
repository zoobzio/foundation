import type { Ref } from "#imports";
import type { IconAlias } from "../icon";
import type {
  ActionDescriptor,
  BulkAction,
  DataTableColumn,
  RowAction,
  SortDirection,
} from "./table";

/**
 * A folder row — foundation-owned and deliberately fixed: consumers map
 * their folder data into it, and folder rendering customizes through the
 * `folder` slots. Files stay generic; folders do not.
 */
export type BrowserFolder = {
  key: string;
  label: string;
  icon?: IconAlias;
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
  icon: IconAlias;
  label: string;
  action: (folder: BrowserFolder) => void;
};

/**
 * Config the consumer provides — pure serializable data. Actions are
 * descriptor records: the key is the action's identity, shared with the
 * handler record wired at `useBrowser`. `actions`/`bulkActions` cover
 * files (selection is files-only); `folderActions` covers folder rows.
 */
export type Config<T> = {
  columns: DataTableColumn<T>[];
  fileKey: keyof T;
  rootLabel?: string;
  rootIcon?: IconAlias;
  actions?: Record<string, ActionDescriptor>;
  folderActions?: Record<string, ActionDescriptor>;
  bulkActions?: Record<string, ActionDescriptor>;
};

export type State<T> = {
  folders: Ref<BrowserFolder[]>;
  files: Ref<T[]>;
  loading: Ref<boolean>;
  initialized: Ref<boolean>;
  path: Ref<BrowserCrumb[]>;
  sortField: Ref<string | null>;
  sortDirection: Ref<SortDirection>;
  selected: Ref<Set<string>>;
};

export type Service<T> = {
  readonly id: string;
  readonly config: Config<T>;
  readonly columns: DataTableColumn<T>[];
  readonly fileKey: keyof T;
  readonly actions: RowAction<T>[];
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
  sortFieldFor(col: DataTableColumn<T>): string;
  isSorted(col: DataTableColumn<T>): boolean;
  getSortIcon(): IconAlias;
  keyOf(row: T): string;
  toggleRow(key: string): void;
  toggleAll(): void;
  clearSelection(): void;
  isRowSelected(row: T): boolean;
  init(): Promise<boolean>;
  fetch(): Promise<void>;
};

/**
 * The consumer-supplied behavior, attached in setup at `useBrowser`: the
 * fetch mechanism plus handlers keyed like the config's descriptor records.
 * This is the erased shape the service receives; `useBrowser` accepts it
 * keyed precisely to the definition's action vocabulary.
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

export type Events = {
  "browser:updated": (event: {
    id: string;
    path: string[];
    folders: number;
    files: number;
  }) => void;
  "browser:navigated": (event: { id: string; path: string[] }) => void;
};
