import { computed, ref } from "vue";
import { vi } from "vitest";
import type { BrowserCrumb, Service } from "../../app/types/data/browser";
import { BROWSER_SORT_ASC_ICON } from "../../app/constants/browser";
import { fakeFileColumns, fakeFiles, fakeFolders } from "#test/data/browser";
import type { FakeFile } from "#test/data/browser";

/**
 * Contract mock for mounting data-browser widgets: a concrete
 * Service<FakeFile> shaped like the real class — plain-value getters over
 * backing refs, vi.fn() commands. Typed against the real contract so tsc
 * flags drift when the Service type changes. `state` exposes the backing
 * refs for tests to drive; state logic depth belongs to the service tests,
 * not here.
 */
export const createMockBrowser = (
  overrides: Partial<Service<FakeFile>> = {},
) => {
  const state = {
    folders: ref(fakeFolders),
    files: ref<FakeFile[]>(fakeFiles),
    loading: ref(false),
    initialized: ref(true),
    path: ref<BrowserCrumb[]>([]),
    sortField: ref<string | null>(null),
    sortDirection: ref<"asc" | "desc">("asc"),
    selected: ref<Set<string>>(new Set()),
  };

  const isAllSelected = computed(
    () =>
      state.files.value.length > 0 &&
      state.files.value.every((row) =>
        state.selected.value.has(String(row.id)),
      ),
  );
  const isIndeterminate = computed(
    () => state.selected.value.size > 0 && !isAllSelected.value,
  );
  const selectAllState = computed<boolean | "indeterminate">(() =>
    isIndeterminate.value ? "indeterminate" : isAllSelected.value,
  );

  const service: Service<FakeFile> = {
    id: "mock-browser",
    config: { columns: fakeFileColumns, fileKey: "id" },

    columns: fakeFileColumns,
    fileKey: "id",
    actions: [],
    folderActions: [],
    bulkActions: [],

    get folders() {
      return state.folders.value;
    },
    get files() {
      return state.files.value;
    },
    get loading() {
      return state.loading.value;
    },
    get initialized() {
      return state.initialized.value;
    },
    get path() {
      return state.path.value;
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

    get pathKeys() {
      return state.path.value.map((crumb) => crumb.key);
    },
    get depth() {
      return state.path.value.length;
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
      return fakeFileColumns.length;
    },

    open: vi.fn(),
    navigate: vi.fn(),
    sortBy: vi.fn(),
    sortFieldFor: (col) => col.sortKey ?? String(col.key),
    isSorted: () => false,
    getSortIcon: () => BROWSER_SORT_ASC_ICON,
    keyOf: (row) => String(row.id),
    toggleRow: vi.fn(),
    toggleAll: vi.fn(),
    clearSelection: vi.fn(),
    isRowSelected: (row) => state.selected.value.has(String(row.id)),
    init: vi.fn(async () => true),
    fetch: vi.fn(async () => {}),

    ...overrides,
  };

  return { service, state };
};
