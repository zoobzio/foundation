import { computed, ref } from "vue";
import { vi } from "vitest";
import type { Service } from "../../app/types/data/table";
import { TABLE_SORT_ASC_ICON } from "../../app/constants/table";
import { fakeColumns, fakeRows } from "#test/data/table";
import type { FakeRow } from "#test/data/table";

/**
 * Contract mock for mounting data-table widgets: a concrete
 * Service<FakeRow> shaped like the real class — plain-value getters
 * over backing refs, vi.fn() commands. Typed against the real contract so tsc
 * flags drift when the Service type changes. `state` exposes the backing refs
 * for tests to drive; state logic depth belongs to the service tests, not
 * here.
 */
export const createMockTable = (
  overrides: Partial<Service<FakeRow>> = {},
) => {
  const state = {
    data: ref<FakeRow[]>(fakeRows),
    loading: ref(false),
    initialized: ref(true),
    page: ref(1),
    pageSize: ref(25),
    pageCount: ref(4),
    total: ref(100),
    sortField: ref<string | null>(null),
    sortDirection: ref<"asc" | "desc">("asc"),
    selected: ref<Set<string>>(new Set()),
    columnOrder: ref(fakeColumns.map((c) => String(c.key))),
  };

  const visibleColumns = computed(() =>
    state.columnOrder.value.flatMap((key) =>
      fakeColumns.filter((c) => String(c.key) === key),
    ),
  );
  const isAllSelected = computed(
    () =>
      state.data.value.length > 0 &&
      state.data.value.every((row) => state.selected.value.has(String(row.id))),
  );
  const isIndeterminate = computed(
    () => state.selected.value.size > 0 && !isAllSelected.value,
  );
  const selectAllState = computed<boolean | "indeterminate">(() =>
    isIndeterminate.value ? "indeterminate" : isAllSelected.value,
  );

  const service: Service<FakeRow> = {
    id: "mock-table",
    config: { columns: fakeColumns, rowKey: "id" },

    columns: fakeColumns,
    rowKey: "id",
    actions: [],
    bulkActions: [],
    pinnedColumns: [],

    get data() {
      return state.data.value;
    },
    get loading() {
      return state.loading.value;
    },
    get initialized() {
      return state.initialized.value;
    },
    get page() {
      return state.page.value;
    },
    get pageSize() {
      return state.pageSize.value;
    },
    get pageCount() {
      return state.pageCount.value;
    },
    get total() {
      return state.total.value;
    },
    get sortField() {
      return state.sortField.value;
    },
    get sortDirection() {
      return state.sortDirection.value;
    },
    get selected() {
      return state.selected.value;
    },
    get columnOrder() {
      return state.columnOrder.value;
    },

    get visibleColumns() {
      return visibleColumns.value;
    },
    get isAllSelected() {
      return isAllSelected.value;
    },
    get isIndeterminate() {
      return isIndeterminate.value;
    },
    get selectAllState() {
      return selectAllState.value;
    },
    get colSpan() {
      return visibleColumns.value.length;
    },

    goToPage: vi.fn(),
    setPageSize: vi.fn(),
    sortBy: vi.fn(),
    sortFieldFor: (col) => col.sortKey ?? String(col.key),
    isSorted: () => false,
    getSortIcon: () => TABLE_SORT_ASC_ICON,
    keyOf: (row) => String(row.id),
    toggleRow: vi.fn(),
    toggleAll: vi.fn(),
    clearSelection: vi.fn(),
    isRowSelected: (row) => state.selected.value.has(String(row.id)),
    toggleColumn: vi.fn(),
    reorderColumns: vi.fn(),
    resetColumns: vi.fn(),
    isColumnPinned: () => false,
    isColumnVisible: () => true,
    init: vi.fn(async () => true),
    fetch: vi.fn(async () => {}),

    ...overrides,
  };

  return { service, state };
};
