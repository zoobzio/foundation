import type { ComputedRef, Ref } from "#imports";
import type { IconAlias } from "#foundation/types/common/iconic";

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
 * Row action — rendered per-row in an actions menu.
 */
export interface RowAction<T> {
  icon: IconAlias;
  label: string;
  action: (row: T) => void;
}

/**
 * Bulk action — rendered when rows are selected.
 */
export interface BulkAction<K> {
  icon: IconAlias;
  label: string;
  action: (selected: Set<K>) => void;
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
 * Config the consumer provides to the factory — pure data.
 */
export type Config<T, K = unknown> = {
  columns: DataTableColumn<T>[];
  rowKey: keyof T;
  actions?: RowAction<T>[];
  bulkActions?: BulkAction<K>[];
  pinnedColumns?: (keyof T)[];
  defaultColumnOrder?: (keyof T)[];
};

export type State<T, K> = {
  data: Ref<T[]>;
  loading: Ref<boolean>;
  initialized: Ref<boolean>;
  page: Ref<number>;
  pageSize: Ref<number>;
  total: Ref<number>;
  pageCount: Ref<number>;
  sortField: Ref<string | null>;
  sortDirection: Ref<SortDirection>;
  selected: Ref<Set<K>>;
  columnOrder: Ref<string[]>;
};

/**
 * The consumer-supplied fetch mechanism — the table's data source.
 */
export type Actions<T, K = unknown> = {
  fetch: (
    params: DataTableFetchParams,
    service: Service<T, K>,
  ) => Promise<DataTableFetchResult<T>>;
};

export type Service<T, K = unknown> = {
  readonly id: string;
  readonly config: Config<T, K>;
  readonly columns: DataTableColumn<T>[];
  readonly rowKey: keyof T;
  readonly actions: RowAction<T>[];
  readonly bulkActions: BulkAction<K>[];
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
  readonly selected: Set<K>;
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
  keyOf(row: T): K;
  toggleRow(key: K): void;
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

export type Table<T, K = unknown> = {
  id: string;
  config: Config<T, K>;

  data: Ref<T[]>;
  loading: Ref<boolean>;
  initialized: Ref<boolean>;

  readonly columns: DataTableColumn<T>[];
  readonly rowKey: keyof T;
  readonly actions: RowAction<T>[];
  readonly bulkActions: BulkAction<K>[];
  readonly pinnedColumns: (keyof T)[];

  page: Ref<number>;
  pageSize: Ref<number>;
  pageCount: Ref<number>;
  total: Ref<number>;
  sortField: Ref<string | null>;
  sortDirection: Ref<SortDirection>;

  selected: Ref<Set<K>>;
  keyOf: (row: T) => K;
  isAllSelected: ComputedRef<boolean>;
  isIndeterminate: ComputedRef<boolean>;
  selectAllState: ComputedRef<boolean | "indeterminate">;

  columnOrder: Ref<string[]>;
  visibleColumns: ComputedRef<DataTableColumn<T>[]>;
  colSpan: ComputedRef<number>;

  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  sortBy: (field: string) => void;
  sortFieldFor: (col: DataTableColumn<T>) => string;
  isSorted: (col: DataTableColumn<T>) => boolean;
  getSortIcon: () => IconAlias;
  toggleRow: (key: K) => void;
  toggleAll: () => void;
  clearSelection: () => void;
  isRowSelected: (row: T) => boolean;
  toggleColumn: (key: keyof T) => void;
  reorderColumns: (order: string[]) => void;
  resetColumns: () => void;
  isColumnPinned: (key: keyof T) => boolean;
  isColumnVisible: (key: keyof T) => boolean;
  init: () => Promise<boolean>;
  fetch: () => Promise<void>;
};
