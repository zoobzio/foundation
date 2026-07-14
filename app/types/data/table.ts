import type { ComputedRef, Ref } from "#imports";
import type { DataTableSnapshot } from "#foundation/schemas/data/table";
import type { IconAlias } from "#foundation/types/common/iconic";
/**
 * Column data type — drives rendering, filtering, and sorting behavior.
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

/**
 * Data table column definition
 */
export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  type?: ColumnType;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sortKey?: string;
  enumValues?: string[];
}

/**
 * Sort direction for table columns
 */
export type SortDirection = "asc" | "desc";

/**
 * Match mode for combining query and keywords
 */
export type MatchMode = "all" | "any";

/**
 * Date filter operator types
 */
export type DateFilterOperator = "before" | "after" | "between";

/**
 * Date filter definition
 */
export interface DateFilter {
  field: string;
  operator: DateFilterOperator;
  value: Date;
  endValue?: Date;
}

/**
 * Facet item with count
 */
export interface FacetItem {
  value: string;
  label: string;
  count: number;
}

/**
 * Facet group
 */
export interface FacetGroup {
  key: string;
  label: string;
  items: FacetItem[];
}

/**
 * Filter value — discriminated by shape.
 */
export type FilterValue =
  | { type: "text"; value: string }
  | { type: "number"; value: number }
  | { type: "number_range"; value: [number, number] }
  | { type: "date"; value: Date }
  | { type: "date_range"; value: [Date, Date] }
  | { type: "enum"; value: string[] }
  | { type: "boolean"; value: boolean };

/**
 * A single filter condition.
 */
export interface TableFilter {
  field: string;
  operator: string;
  value: FilterValue;
}

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
 * The writable slice of table state.
 */
export interface DataTablePayload {
  query: string;
  keywords: string;
  match: MatchMode;
  page: number;
  pageSize: number;
  selectedFacets: Set<string>;
  dateFilters: DateFilter[];
}

/**
 * Config the consumer provides to the factory.
 */
export interface DataTableConfig<T, K = unknown> {
  columns: DataTableColumn<T>[];
  rowKey: keyof T;
  fetch: (params: DataTableFetchParams) => Promise<DataTableFetchResult<T>>;
  actions?: RowAction<T>[];
  bulkActions?: BulkAction<K>[];
  pinnedColumns?: (keyof T)[];
  defaultColumnOrder?: (keyof T)[];
}

/**
 * Parameters passed to the fetch function
 */
export interface DataTableFetchParams {
  page: number;
  pageSize: number;
  sortField: string | null;
  sortDirection: SortDirection;
  query: string;
  keywords: string;
  match: MatchMode;
  facets: Set<string>;
  dateFilters: DateFilter[];
}

/**
 * Result returned from the fetch function
 */
export interface DataTableFetchResult<T> {
  data: T[];
  total: number;
  pageCount: number;
  facets?: FacetGroup[];
}

/**
 * The reactive interface for a data table.
 * Returned by the table factory. Components accept this as their prop.
 */
export interface Table<T, K = unknown> {
  // Reactive state
  data: Ref<T[]>;
  loading: Ref<boolean>;

  // Static config
  readonly columns: DataTableColumn<T>[];
  readonly rowKey: keyof T;
  readonly actions: RowAction<T>[];
  readonly bulkActions: BulkAction<K>[];
  readonly pinnedColumns: (keyof T)[];

  // Pagination
  page: Ref<number>;
  pageSize: Ref<number>;
  pageCount: Ref<number>;
  total: Ref<number>;

  // Sorting
  sortField: Ref<string | null>;
  sortDirection: Ref<SortDirection>;

  // Search
  query: Ref<string>;
  keywords: Ref<string>;
  match: Ref<MatchMode>;

  // Facets
  facetGroups: Ref<FacetGroup[]>;
  selectedFacets: Ref<Set<string>>;

  // Date filters
  dateFilters: Ref<DateFilter[]>;

  // Filters
  filters: ComputedRef<TableFilter[]>;

  // Selection
  selected: Ref<Set<K>>;
  isAllSelected: Ref<boolean>;
  isIndeterminate: Ref<boolean>;

  // Columns
  columnOrder: Ref<string[]>;
  visibleColumns: Ref<DataTableColumn<T>[]>;

  // Getters
  selectAllState: Ref<boolean | "indeterminate">;
  colSpan: Ref<number>;
  dateColumns: Ref<DataTableColumn<T>[]>;

  // Actions
  goToPage: (page: number) => void;
  sortBy: (field: string) => void;
  clearFacets: () => void;
  addDateFilter: (filter: DateFilter) => void;
  removeDateFilter: (field: string) => void;
  clearDateFilters: () => void;
  toggleRow: (key: K) => void;
  toggleAll: () => void;
  clearSelection: () => void;
  sortFieldFor: (col: DataTableColumn<T>) => string;
  isSorted: (col: DataTableColumn<T>) => boolean;
  getSortIcon: () => IconAlias;
  isRowSelected: (row: T) => boolean;
  addFilter: (filter: TableFilter) => void;
  removeFilter: (index: number) => void;
  clearFilters: () => void;
  toggleColumn: (key: keyof T) => void;
  reorderColumns: (order: string[]) => void;
  resetColumns: () => void;
  isColumnPinned: (key: keyof T) => boolean;
  isColumnVisible: (key: keyof T) => boolean;
  setPageSize: (size: number) => void;
  update: (payload: Partial<DataTablePayload>) => void;
  getSnapshot: () => DataTableSnapshot;
  restoreSnapshot: (snapshot: DataTableSnapshot) => void;
  init: () => Promise<boolean>;
  initialized: Ref<boolean>;
  fetch: () => Promise<void>;
}

