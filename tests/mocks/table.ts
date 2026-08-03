import { computed, ref } from "vue";
import { vi } from "vitest";
import type { Table } from "#foundation/types/data/table";
import {
  TABLE_SORT_ASC_ICON,
} from "#foundation/constants/table";
import { fakeColumns, fakeRows } from "#test/data/table";
import type { FakeRow } from "#test/data/table";

/**
 * Contract mock for mounting data-table widgets: a concrete
 * Table<FakeRow, number> with live refs and vi.fn() commands. Typed against
 * the real contract so tsc flags drift when the Table type changes. Override
 * refs/fns per test; state logic depth belongs to the service tests, not here.
 */
export const createMockTable = (
  overrides: Partial<Table<FakeRow, number>> = {},
): Table<FakeRow, number> => {
  const data = ref<FakeRow[]>(fakeRows);
  const selected = ref<Set<number>>(new Set());
  const columnOrder = ref(fakeColumns.map((c) => String(c.key)));

  const visibleColumns = computed(() =>
    columnOrder.value.flatMap((key) =>
      fakeColumns.filter((c) => String(c.key) === key),
    ),
  );
  const isAllSelected = computed(
    () =>
      data.value.length > 0 &&
      data.value.every((row) => selected.value.has(row.id)),
  );
  const isIndeterminate = computed(
    () => selected.value.size > 0 && !isAllSelected.value,
  );
  const selectAllState = computed<boolean | "indeterminate">(() =>
    isIndeterminate.value ? "indeterminate" : isAllSelected.value,
  );

  return {
    id: "mock-table",
    config: { columns: fakeColumns, rowKey: "id" },

    data,
    loading: ref(false),
    initialized: ref(true),

    columns: fakeColumns,
    rowKey: "id",
    actions: [],
    bulkActions: [],
    pinnedColumns: [],

    page: ref(1),
    pageSize: ref(25),
    pageCount: ref(4),
    total: ref(100),
    sortField: ref<string | null>(null),
    sortDirection: ref("asc"),

    selected,
    keyOf: (row) => row.id,
    isAllSelected,
    isIndeterminate,
    selectAllState,

    columnOrder,
    visibleColumns,
    colSpan: computed(() => visibleColumns.value.length),

    goToPage: vi.fn(),
    setPageSize: vi.fn(),
    sortBy: vi.fn(),
    sortFieldFor: (col) => col.sortKey ?? String(col.key),
    isSorted: () => false,
    getSortIcon: () => TABLE_SORT_ASC_ICON,
    toggleRow: vi.fn(),
    toggleAll: vi.fn(),
    clearSelection: vi.fn(),
    isRowSelected: (row) => selected.value.has(row.id),
    toggleColumn: vi.fn(),
    reorderColumns: vi.fn(),
    resetColumns: vi.fn(),
    isColumnPinned: () => false,
    isColumnVisible: () => true,
    init: vi.fn(async () => true),
    fetch: vi.fn(async () => {}),

    ...overrides,
  };
};
