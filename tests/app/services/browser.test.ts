// Constructor-injected seams in the services/table.test.ts mold —
// hand-rolled State refs, a vi.fn() Actions fake, and the shim's NuxtApp.
// No mounting; every test drives a state transition and asserts both the
// new state and the side-channel contracts (fetch params, hook emission).
import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useNuxtApp } from "#imports";
import { BrowserService } from "../../../app/services/browser";
import type {
  Actions,
  BrowserCrumb,
  BrowserFetchResult,
  Config,
  State,
} from "../../../app/types/data/browser";
import type { SortDirection } from "../../../app/types/data/table";
import {
  fakeBrowserBulkActions,
  fakeFileActions,
  fakeFileColumns,
  fakeFiles,
  fakeFolderActions,
  fakeFolders,
} from "#test/data/browser";
import type { FakeFile } from "#test/data/browser";

const makeState = (): State<FakeFile> => ({
  folders: ref([]),
  files: ref<FakeFile[]>([]),
  loading: ref(false),
  initialized: ref(false),
  path: ref<BrowserCrumb[]>([]),
  sortField: ref<string | null>(null),
  sortDirection: ref<SortDirection>("asc"),
  selected: ref<Set<string>>(new Set()),
});

const makeActions = (): Actions<FakeFile> => ({
  fetch: vi.fn(
    async (): Promise<BrowserFetchResult<FakeFile>> => ({
      folders: fakeFolders,
      files: fakeFiles,
    }),
  ),
});

const fixture = <V>(value: V | undefined): V => {
  if (value === undefined) throw new Error("missing fixture entry");
  return value;
};

const makeService = (
  overrides: {
    state?: State<FakeFile>;
    actions?: Actions<FakeFile>;
    config?: Partial<Config<FakeFile>>;
  } = {},
) => {
  const state = overrides.state ?? makeState();
  const actions = overrides.actions ?? makeActions();
  const nuxt = useNuxtApp();
  const emitSpy = vi.spyOn(nuxt, "callHook");
  const service = new BrowserService<FakeFile>(
    nuxt,
    "test-browser",
    { columns: fakeFileColumns, fileKey: "id", ...overrides.config },
    state,
    actions,
  );
  return { service, state, actions, emitSpy };
};

describe("fetch", () => {
  it("passes the path and sort params and applies the result", async () => {
    const { service, state, actions } = makeService();
    state.path.value = [
      { key: "media", label: "Media" },
      { key: "2025", label: "2025" },
    ];
    state.sortField.value = "size";
    state.sortDirection.value = "desc";

    await service.fetch();

    expect(actions.fetch).toHaveBeenCalledWith(
      { path: ["media", "2025"], sortField: "size", sortDirection: "desc" },
      service,
    );
    expect(service.files).toEqual(fakeFiles);
  });

  it("re-sorts fetched folders alphabetically by label", async () => {
    const { service } = makeService();
    await service.fetch();
    expect(service.folders.map((f) => f.label)).toEqual([
      "Archive",
      "Drafts",
      "Media",
    ]);
  });

  it("holds loading during flight and clears it after", async () => {
    const box: { resolve?: (r: BrowserFetchResult<FakeFile>) => void } = {};
    const actions: Actions<FakeFile> = {
      fetch: vi.fn(
        () =>
          new Promise<BrowserFetchResult<FakeFile>>((res) => {
            box.resolve = res;
          }),
      ),
    };
    const { service } = makeService({ actions });

    const flight = service.fetch();
    expect(service.loading).toBe(true);
    box.resolve?.({ folders: [], files: [] });
    await flight;
    expect(service.loading).toBe(false);
  });

  it("clears loading and still emits when the action throws", async () => {
    const actions: Actions<FakeFile> = {
      fetch: vi.fn(async () => Promise.reject(new Error("boom"))),
    };
    const { service, emitSpy } = makeService({ actions });

    await expect(service.fetch()).rejects.toThrow("boom");
    expect(service.loading).toBe(false);
    expect(emitSpy).toHaveBeenCalledWith("browser:updated", {
      id: "test-browser",
      path: [],
      folders: 0,
      files: 0,
    });
  });

  it("emits updated with the path and section counts", async () => {
    const { service, emitSpy } = makeService();
    await service.fetch();
    expect(emitSpy).toHaveBeenCalledWith("browser:updated", {
      id: "test-browser",
      path: [],
      folders: fakeFolders.length,
      files: fakeFiles.length,
    });
  });
});

describe("init", () => {
  it("fetches once and guards re-entry", async () => {
    const { service, actions } = makeService();
    await service.init();
    await service.init();
    expect(actions.fetch).toHaveBeenCalledTimes(1);
    expect(service.initialized).toBe(true);
  });
});

describe("navigation", () => {
  it("open descends: pushes the crumb, clears selection, refetches, emits", async () => {
    const { service, state, actions, emitSpy } = makeService();
    state.selected.value = new Set(["1"]);

    service.open({ key: "media", label: "Media" });

    expect(service.path).toEqual([{ key: "media", label: "Media" }]);
    expect(service.pathKeys).toEqual(["media"]);
    expect(service.depth).toBe(1);
    expect(service.selected).toEqual(new Set());
    expect(actions.fetch).toHaveBeenCalledWith(
      { path: ["media"], sortField: null, sortDirection: "asc" },
      service,
    );
    expect(emitSpy).toHaveBeenCalledWith("browser:navigated", {
      id: "test-browser",
      path: ["media"],
    });
  });

  it("navigate truncates the trail to the given index", async () => {
    const { service, state, emitSpy } = makeService();
    state.path.value = [
      { key: "media", label: "Media" },
      { key: "2025", label: "2025" },
      { key: "q1", label: "Q1" },
    ];
    state.selected.value = new Set(["1"]);

    service.navigate(1);

    expect(service.pathKeys).toEqual(["media"]);
    expect(service.selected).toEqual(new Set());
    expect(emitSpy).toHaveBeenCalledWith("browser:navigated", {
      id: "test-browser",
      path: ["media"],
    });
  });

  it("navigate to the root empties the trail", () => {
    const { service, state } = makeService();
    state.path.value = [{ key: "media", label: "Media" }];
    service.navigate(0);
    expect(service.pathKeys).toEqual([]);
  });

  it("navigate no-ops at the current position and out of range", () => {
    const { service, state, actions } = makeService();
    state.path.value = [{ key: "media", label: "Media" }];
    service.navigate(1);
    service.navigate(2);
    service.navigate(-1);
    expect(service.pathKeys).toEqual(["media"]);
    expect(actions.fetch).not.toHaveBeenCalled();
  });
});

describe("sorting", () => {
  it("toggles direction on the same field, resets on a new one", async () => {
    const { service, actions } = makeService();
    service.sortBy("name");
    expect(service.sortField).toBe("name");
    expect(service.sortDirection).toBe("asc");
    service.sortBy("name");
    expect(service.sortDirection).toBe("desc");
    service.sortBy("size");
    expect(service.sortField).toBe("size");
    expect(service.sortDirection).toBe("asc");
    expect(actions.fetch).toHaveBeenCalledTimes(3);
  });

  it("resolves sort columns through sortKey and marks the sorted one", () => {
    const { service } = makeService();
    const sized = { ...fixture(fakeFileColumns.at(1)), sortKey: "bytes" };
    expect(service.sortFieldFor(sized)).toBe("bytes");
    service.sortBy("bytes");
    expect(service.isSorted(sized)).toBe(true);
    expect(service.getSortIcon()).toBe("chevron-up");
    service.sortBy("bytes");
    expect(service.getSortIcon()).toBe("chevron-down");
  });
});

describe("selection", () => {
  it("tracks per-row toggles through the aggregate states", async () => {
    const { service } = makeService();
    await service.fetch();
    expect(service.selectAllState).toBe(false);
    service.toggleRow("1");
    expect(service.isRowSelected(fixture(fakeFiles.at(0)))).toBe(true);
    expect(service.selectAllState).toBe("indeterminate");
    service.toggleAll();
    expect(service.isAllSelected).toBe(true);
    expect(service.selectAllState).toBe(true);
    service.toggleAll();
    expect(service.selected).toEqual(new Set());
    service.toggleRow("2");
    service.clearSelection();
    expect(service.selected).toEqual(new Set());
  });

  it("keyOf resolves the configured fileKey", () => {
    const { service } = makeService();
    expect(service.keyOf(fixture(fakeFiles.at(0)))).toBe("1");
  });
});

describe("action joins", () => {
  it("joins the three descriptor records to their handlers by key", () => {
    const download = vi.fn();
    const remove = vi.fn();
    const rename = vi.fn();
    const purge = vi.fn();
    const { service } = makeService({
      config: {
        actions: fakeFileActions,
        folderActions: fakeFolderActions,
        bulkActions: fakeBrowserBulkActions,
      },
      actions: {
        ...makeActions(),
        actions: { download, delete: remove },
        folderActions: { rename },
        bulkActions: { deleteSelected: purge },
      },
    });

    const first = fixture(fakeFiles.at(0));
    const second = fixture(fakeFiles.at(1));
    service.actions.at(0)?.action(first);
    expect(download).toHaveBeenCalledWith(first);
    service.actions.at(1)?.action(second);
    expect(remove).toHaveBeenCalledWith(second);

    const folder = fixture(fakeFolders.at(0));
    service.folderActions.at(0)?.action(folder);
    expect(rename).toHaveBeenCalledWith(folder);

    service.bulkActions.at(0)?.action(new Set(["1"]));
    expect(purge).toHaveBeenCalledWith(new Set(["1"]));
  });

  it("counts the selection and actions columns into colSpan", () => {
    const { service } = makeService({
      config: {
        actions: fakeFileActions,
        bulkActions: fakeBrowserBulkActions,
      },
      actions: {
        ...makeActions(),
        actions: { download: vi.fn(), delete: vi.fn() },
        bulkActions: { deleteSelected: vi.fn() },
      },
    });
    expect(service.colSpan).toBe(fakeFileColumns.length + 2);
  });
});
