/**
 * The reactive interface for a data table.
 * Returned by useTable(). Components accept this as their prop.
 * All state is Ref-wrapped for reactivity. Recipes are ComputedRef.
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

  // Selection
  selected: Ref<Set<K>>;
  isAllSelected: Ref<boolean>;
  isIndeterminate: Ref<boolean>;

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
  setPageSize: (size: number) => void;
  update: (payload: Partial<DataTablePayload>) => void;
  getSnapshot: () => DataTableSnapshot;
  restoreSnapshot: (snapshot: DataTableSnapshot) => void;
  init: () => Promise<boolean>;
  initialized: Ref<boolean>;
  fetch: () => Promise<void>;
}
