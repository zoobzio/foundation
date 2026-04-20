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
  | "email"
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
 * Row action — rendered per-row in an actions menu.
 */
export interface RowAction<T> {
  icon: IconAlias;
  label: string;
  action: (row: T) => void;
}

/**
 * The interface that widgets accept.
 * Matches the raw Pinia store shape.
 */
export interface DataTableState<T, K = unknown> {
  // Data
  data: T[];
  loading: boolean;
  columns: DataTableColumn<T>[];
  rowKey: keyof T;
  actions: RowAction<T>[];

  // Pagination
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  goToPage: (page: number) => void;

  // Sorting
  sortField: string | null;
  sortDirection: SortDirection;
  sortBy: (field: string) => void;

  // Search
  query: string;
  keywords: string;
  match: MatchMode;

  // Facets
  facetGroups: FacetGroup[];
  selectedFacets: Set<string>;
  clearFacets: () => void;

  // Date filters
  dateFilters: DateFilter[];
  addDateFilter: (filter: DateFilter) => void;
  removeDateFilter: (field: string) => void;
  clearDateFilters: () => void;

  // Selection
  selected: Set<K>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  toggleRow: (key: K) => void;
  toggleAll: () => void;
  clearSelection: () => void;

  // Getters
  sortFieldFor: (col: DataTableColumn<T>) => string;
  isSorted: (col: DataTableColumn<T>) => boolean;
  getSortIcon: () => IconAlias;
  isRowSelected: (row: T) => boolean;
  selectAllState: boolean | "indeterminate";
  colSpan: number;
  setPageSize: (size: number) => void;
  dateColumns: DataTableColumn<T>[];

  // Mutation
  update: (payload: Partial<DataTablePayload>) => void;

  // Persistence
  getSnapshot: () => DataTableSnapshot;
  restoreSnapshot: (snapshot: DataTableSnapshot) => void;

  // Lifecycle
  fetch: () => Promise<void>;
}

/**
 * Injection key for DataTable widget config lookup.
 */
export const DATA_TABLE_CONFIG: InjectionKey<(id: string) => DataTableSnapshot | undefined> = Symbol("DATA_TABLE_CONFIG");

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
export interface DataTableConfig<T> {
  columns: DataTableColumn<T>[];
  rowKey: keyof T;
  fetch: (params: DataTableFetchParams) => Promise<DataTableFetchResult<T>>;
  actions?: RowAction<T>[];
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

export type DataTablePassthrough = {
  root?: Passthrough<GroupProps>;
  toolbar?: Passthrough<GroupProps>;
  table?: Passthrough<TableProps>;
  thead?: Passthrough<TheadProps>;
  tbody?: Passthrough<TbodyProps>;
  empty?: Passthrough<TdProps>;
  pagination?: Passthrough<GroupProps>;
};

export type DataTableProps<T, K = unknown> = {
  store: WidgetStore<DataTableState<T, K>>;
  selectable?: boolean;
  pt?: DataTablePassthrough;
};
