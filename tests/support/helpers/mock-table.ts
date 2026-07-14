import { ref, computed } from "vue";
import { vi } from "vitest";
import type { Table, DataTableColumn, RowAction, BulkAction, TableFilter } from "#foundation/types/data/table";
import type { IconAlias } from "#foundation/types/common/iconic";

export interface MockTableOptions<T, K = unknown> {
  columns: DataTableColumn<T>[];
  rows?: T[];
  rowKey?: keyof T;
  actions?: RowAction<T>[];
  bulkActions?: BulkAction<K>[];
  pinnedColumns?: (keyof T)[];
  filters?: TableFilter[];
}

/**
 * Creates a mock Table<T, K> with reactive refs and vi.fn() stubs for all methods.
 * Suitable for mounting data widgets in tests.
 */
export const createMockTable = <T, K = unknown>(
  options: MockTableOptions<T, K>,
): Table<T, K> => {
  const {
    columns,
    rows = [],
    rowKey = "id" as keyof T,
    actions = [],
    bulkActions = [],
    pinnedColumns = [],
    filters: initialFilters = [],
  } = options;

  const columnKeys = columns.map((c) => String(c.key));
  const visibleCols = ref<DataTableColumn<T>[]>(columns);

  return {
    data: ref<T[]>(rows),
    loading: ref(false),
    columns,
    rowKey,
    actions,
    bulkActions,
    pinnedColumns,
    page: ref(1),
    pageSize: ref(25),
    pageCount: ref(1),
    total: ref(rows.length),
    sortField: ref(null),
    sortDirection: ref("asc"),
    query: ref(""),
    keywords: ref(""),
    match: ref("all"),
    facetGroups: ref([]),
    selectedFacets: ref(new Set()),
    dateFilters: ref([]),
    filters: computed(() => initialFilters),
    selected: ref<Set<K>>(new Set()),
    isAllSelected: ref(false),
    isIndeterminate: ref(false),
    columnOrder: ref(columnKeys),
    visibleColumns: visibleCols,
    selectAllState: ref<boolean | "indeterminate">(false),
    colSpan: ref(columns.length),
    dateColumns: ref<DataTableColumn<T>[]>(columns.filter((c) => c.type === "date" || c.type === "datetime")),
    goToPage: vi.fn(),
    sortBy: vi.fn(),
    clearFacets: vi.fn(),
    addDateFilter: vi.fn(),
    removeDateFilter: vi.fn(),
    clearDateFilters: vi.fn(),
    toggleRow: vi.fn(),
    toggleAll: vi.fn(),
    clearSelection: vi.fn(),
    sortFieldFor: (col) => col.sortKey ?? String(col.key),
    isSorted: () => false,
    getSortIcon: () => "chevron-up" as IconAlias,
    isRowSelected: () => false,
    addFilter: vi.fn(),
    removeFilter: vi.fn(),
    clearFilters: vi.fn(),
    toggleColumn: vi.fn(),
    reorderColumns: vi.fn(),
    resetColumns: vi.fn(),
    isColumnPinned: () => false,
    isColumnVisible: () => true,
    setPageSize: vi.fn(),
    update: vi.fn(),
    getSnapshot: vi.fn(() => ({
      query: "",
      keywords: "",
      match: "all" as const,
      page: 1,
      pageSize: 25,
      selectedFacets: [],
      dateFilters: [],
      sortField: null,
      sortDirection: "asc" as const,
      columnOrder: columnKeys,
    })),
    restoreSnapshot: vi.fn(),
    init: vi.fn(async () => true),
    initialized: ref(true),
    fetch: vi.fn(async () => {}),
  };
};
