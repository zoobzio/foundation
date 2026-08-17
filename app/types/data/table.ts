import type { Ref } from "#imports";
import type { IconAlias } from "../common/iconic";

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
}

export type SortDirection = "asc" | "desc";

/**
 * The serializable half of a row/bulk action: how it renders. The behavior
 * half is a handler registered under the same key at `useTable`.
 */
export interface ActionDescriptor {
  icon: IconAlias;
  label: string;
}

/**
 * Row action — rendered per-row in an actions menu. The live shape the
 * service exposes: descriptor joined with its handler.
 */
export interface RowAction<T> {
  icon: IconAlias;
  label: string;
  action: (row: T) => void;
}

/**
 * Bulk action — rendered when rows are selected. The live shape the service
 * exposes: descriptor joined with its handler.
 */
export interface BulkAction {
  icon: IconAlias;
  label: string;
  action: (selected: Set<string>) => void;
}

/**
 * Parameters passed to the fetch action. The table owns paging and sort only;
 * the consumer's fetch action closes over its own filtering.
 */
export interface DataTableFetchParams {
  page: number;
  pageSize: number;
  sortField: string | null;
  sortDirection: SortDirection;
}

export interface DataTableFetchResult<T> {
  data: T[];
  total: number;
  pageCount: number;
}

/**
 * Config the consumer provides — pure serializable data. Actions are
 * descriptor records: the key is the action's identity, shared with the
 * handler record wired at `useTable`.
 */
export type Config<T> = {
  columns: DataTableColumn<T>[];
  rowKey: keyof T;
  actions?: Record<string, ActionDescriptor>;
  bulkActions?: Record<string, ActionDescriptor>;
  pinnedColumns?: (keyof T)[];
  defaultColumnOrder?: (keyof T)[];
};

export type State<T> = {
  data: Ref<T[]>;
  loading: Ref<boolean>;
  initialized: Ref<boolean>;
  page: Ref<number>;
  pageSize: Ref<number>;
  total: Ref<number>;
  pageCount: Ref<number>;
  sortField: Ref<string | null>;
  sortDirection: Ref<SortDirection>;
  selected: Ref<Set<string>>;
  columnOrder: Ref<string[]>;
};

/**
 * The consumer-supplied behavior, attached in setup at `useTable`: the fetch
 * mechanism plus handlers keyed like the config's descriptor records. This is
 * the erased shape the service receives; `useTable` accepts it keyed
 * precisely to the definition's action vocabulary.
 */
export type Actions<T> = {
  fetch: (
    params: DataTableFetchParams,
    service: Service<T>,
  ) => Promise<DataTableFetchResult<T>>;
  actions?: Record<string, (row: T) => void>;
  bulkActions?: Record<string, (selected: Set<string>) => void>;
};

export type Service<T> = {
  readonly id: string;
  readonly config: Config<T>;
  readonly columns: DataTableColumn<T>[];
  readonly rowKey: keyof T;
  readonly actions: RowAction<T>[];
  readonly bulkActions: BulkAction[];
  readonly pinnedColumns: (keyof T)[];

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
  readonly isAllSelected: boolean;
  readonly isIndeterminate: boolean;
  readonly selectAllState: boolean | "indeterminate";
  readonly colSpan: number;

  goToPage(page: number): void;
  setPageSize(size: number): void;
  sortBy(field: string): void;
  sortFieldFor(col: DataTableColumn<T>): string;
  isSorted(col: DataTableColumn<T>): boolean;
  getSortIcon(): IconAlias;
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
  init(): Promise<boolean>;
  fetch(): Promise<void>;
};

export type Events = {
  "table:updated": (event: { id: string; total: number }) => void;
};
