// Constructor-injected seams — a plain state container, a vi.fn() Actions
// fake, and vi.fn() listeners. Every test drives a state transition and
// asserts both the new state and the side-channel contracts (fetch params,
// events).
import { describe, expect, it, vi } from "vitest";
import { BrowserService } from "../src/service";
import { createBrowserState } from "../src/state";
import type {
  Actions,
  BrowserFetchResult,
  Change,
  Config,
  Options,
  State,
} from "../src/types";
import {
  fakeBrowserBulkActions,
  fakeConfig,
  fakeFileActions,
  fakeFileColumns,
  fakeFiles,
  fakeFolderActions,
  fakeFolders,
} from "./data";
import type { FakeFile } from "./data";

const makeActions = (): Actions<FakeFile> => ({
  fetch: vi.fn(async (): Promise<BrowserFetchResult<FakeFile>> => ({
    folders: fakeFolders,
    files: fakeFiles,
  })),
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
    options?: Options<FakeFile>;
  } = {},
) => {
  const config = { ...fakeConfig, ...overrides.config };
  const state = overrides.state ?? createBrowserState<FakeFile>();
  const actions = overrides.actions ?? makeActions();
  const service = new BrowserService<FakeFile>(
    "test-browser",
    config,
    state,
    actions,
    overrides.options,
  );
  const updated = vi.fn();
  const navigated = vi.fn();
  const filtered = vi.fn();
  service.on("updated", updated);
  service.on("navigated", navigated);
  service.on("filtered", filtered);
  return { service, state, actions, updated, navigated, filtered };
};

describe("config", () => {
  it("exposes the config surface", () => {
    const { service } = makeService();
    expect(service.columns).toBe(fakeFileColumns);
    expect(service.fileKey).toBe("id");
    expect(service.actions).toEqual([]);
    expect(service.folderActions).toEqual([]);
    expect(service.bulkActions).toEqual([]);
  });
});

describe("fetch", () => {
  it("passes the path and sort params and applies the result", async () => {
    const { service, state, actions } = makeService();
    state.path = [
      { key: "media", label: "Media" },
      { key: "2025", label: "2025" },
    ];
    state.sortField = "size";
    state.sortDirection = "desc";

    await service.fetch();

    expect(actions.fetch).toHaveBeenCalledWith(
      {
        path: ["media", "2025"],
        sortField: "size",
        sortDirection: "desc",
        query: "",
        filters: [],
      },
      service,
    );
    expect(service.files).toEqual(fakeFiles);
  });

  it("keeps folders in the order the fetch returns them", async () => {
    const folders = [
      { key: "media", label: "Media" },
      { key: "drafts", label: "Drafts" },
      { key: "archive", label: "Archive" },
    ];
    const actions: Actions<FakeFile> = {
      fetch: vi.fn(async () => ({ folders, files: fakeFiles })),
    };
    const { service } = makeService({ actions });
    await service.fetch();
    expect(service.folders.map((f) => f.label)).toEqual([
      "Media",
      "Drafts",
      "Archive",
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
    const { service, updated } = makeService({ actions });

    await expect(service.fetch()).rejects.toThrow("boom");
    expect(service.loading).toBe(false);
    expect(updated).toHaveBeenCalledWith({
      id: "test-browser",
      path: [],
      folders: 0,
      files: 0,
    });
  });

  it("emits updated with the path and section counts", async () => {
    const { service, updated } = makeService();
    await service.fetch();
    expect(updated).toHaveBeenCalledWith({
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
    const { service, state, actions, navigated } = makeService();
    state.selected = new Set(["1"]);

    service.open({ key: "media", label: "Media" });

    expect(service.path).toEqual([{ key: "media", label: "Media" }]);
    expect(service.pathKeys).toEqual(["media"]);
    expect(service.depth).toBe(1);
    expect(service.selected).toEqual(new Set());
    expect(actions.fetch).toHaveBeenCalledWith(
      {
        path: ["media"],
        sortField: null,
        sortDirection: "asc",
        query: "",
        filters: [],
      },
      service,
    );
    expect(navigated).toHaveBeenCalledWith({
      id: "test-browser",
      path: ["media"],
    });
  });

  it("navigate truncates the trail to the given index", async () => {
    const { service, state, navigated } = makeService();
    state.path = [
      { key: "media", label: "Media" },
      { key: "2025", label: "2025" },
      { key: "q1", label: "Q1" },
    ];
    state.selected = new Set(["1"]);

    service.navigate(1);

    expect(service.pathKeys).toEqual(["media"]);
    expect(service.selected).toEqual(new Set());
    expect(navigated).toHaveBeenCalledWith({
      id: "test-browser",
      path: ["media"],
    });
  });

  it("navigate to the root empties the trail", () => {
    const { service, state } = makeService();
    state.path = [{ key: "media", label: "Media" }];
    service.navigate(0);
    expect(service.pathKeys).toEqual([]);
  });

  it("navigate no-ops at the current position and out of range", () => {
    const { service, state, actions, navigated } = makeService();
    state.path = [{ key: "media", label: "Media" }];
    service.navigate(1);
    service.navigate(2);
    service.navigate(-1);
    expect(service.pathKeys).toEqual(["media"]);
    expect(actions.fetch).not.toHaveBeenCalled();
    expect(navigated).not.toHaveBeenCalled();
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
    service.sortBy("bytes");
    expect(service.isSorted(sized)).toBe(true);
    expect(service.sortDirection).toBe("desc");
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

  it("selects folders beside files, under their own keys", async () => {
    const { service } = makeService();
    await service.fetch();
    const media = fixture(fakeFolders.find((f) => f.key === "media"));
    service.toggleFolder("media");
    expect(service.isFolderSelected(media)).toBe(true);
    expect(service.selectedFolders).toEqual(new Set(["media"]));
    expect(service.selected).toEqual(new Set());
    expect(service.hasSelection).toBe(true);
    expect(service.selectionCount).toBe(1);
    expect(service.selectAllState).toBe("indeterminate");
    service.toggleFolder("media");
    expect(service.isFolderSelected(media)).toBe(false);
    expect(service.hasSelection).toBe(false);
  });

  it("toggleAll takes every folder and file, and all means both", async () => {
    const { service } = makeService();
    await service.fetch();
    service.toggleAll();
    expect(service.selected).toEqual(new Set(["1", "2", "3"]));
    expect(service.selectedFolders).toEqual(
      new Set(["archive", "drafts", "media"]),
    );
    expect(service.selectionCount).toBe(6);
    expect(service.selectAllState).toBe(true);
    service.toggleFolder("drafts");
    expect(service.selectAllState).toBe("indeterminate");
    service.toggleAll();
    expect(service.selectAllState).toBe(true);
    service.toggleAll();
    expect(service.selectionCount).toBe(0);
  });

  it("isAllSelected holds over a listing of folders alone", async () => {
    const actions: Actions<FakeFile> = {
      fetch: vi.fn(async () => ({ folders: fakeFolders, files: [] })),
    };
    const { service } = makeService({ actions });
    await service.fetch();
    service.toggleAll();
    expect(service.isAllSelected).toBe(true);
  });

  it("a fetch drops what it no longer lists from the selection", async () => {
    let result: BrowserFetchResult<FakeFile> = {
      folders: fakeFolders,
      files: fakeFiles,
    };
    const actions: Actions<FakeFile> = { fetch: vi.fn(async () => result) };
    const { service } = makeService({ actions });
    await service.fetch();
    service.toggleAll();
    result = {
      folders: fakeFolders.filter((f) => f.key === "media"),
      files: fakeFiles.filter((f) => f.id !== 2),
    };
    await service.fetch();
    expect(service.selected).toEqual(new Set(["1", "3"]));
    expect(service.selectedFolders).toEqual(new Set(["media"]));
  });

  it("a fetch that lists the whole selection leaves it untouched", async () => {
    const { service, state } = makeService();
    await service.fetch();
    service.toggleRow("1");
    service.toggleFolder("media");
    const { selected, selectedFolders } = state;
    const change = vi.fn();
    service.on("change", change);
    await service.fetch();
    expect(state.selected).toBe(selected);
    expect(state.selectedFolders).toBe(selectedFolders);
    const written = change.mock.calls.map(
      ([c]) => (c as Change<FakeFile>).field,
    );
    expect(written).toContain("files");
    expect(written).not.toContain("selected");
    expect(written).not.toContain("selectedFolders");
  });

  it("a failed fetch keeps the selection", async () => {
    const actions = makeActions();
    const { service } = makeService({ actions });
    await service.fetch();
    service.toggleRow("1");
    vi.mocked(actions.fetch).mockRejectedValueOnce(new Error("down"));
    await expect(service.fetch()).rejects.toThrow("down");
    expect(service.selected).toEqual(new Set(["1"]));
  });

  it("isAllSelected is false with no files", () => {
    const { service } = makeService();
    expect(service.isAllSelected).toBe(false);
    expect(service.isIndeterminate).toBe(false);
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

    service.bulkActions.at(0)?.action(new Set(["1"]), new Set(["media"]));
    expect(purge).toHaveBeenCalledWith(new Set(["1"]), new Set(["media"]));
  });

  it("a descriptor without a handler is a no-op", () => {
    const { service } = makeService({
      config: { actions: fakeFileActions },
    });
    expect(service.actions.map((a) => a.label)).toEqual(["Download", "Delete"]);
    expect(() =>
      service.actions.at(0)?.action(fixture(fakeFiles.at(0))),
    ).not.toThrow();
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

  it("counts the shared trailing column when only folder actions exist", () => {
    const { service } = makeService({
      config: { folderActions: fakeFolderActions },
      actions: { ...makeActions(), folderActions: { rename: vi.fn() } },
    });
    expect(service.colSpan).toBe(fakeFileColumns.length + 1);
  });
});

describe("middleware", () => {
  it("get middleware shapes every read of its field", () => {
    const { service, state } = makeService({
      options: {
        get: { state: { sortField: (field) => field?.toUpperCase() ?? null } },
      },
    });
    state.sortField = "name";
    expect(service.sortField).toBe("NAME");
    expect(state.sortField).toBe("name");
  });

  it("set middleware shapes the stored value", () => {
    const { service, state } = makeService({
      options: {
        set: { state: { sortField: (field) => field?.trim() ?? null } },
      },
    });
    service.sortBy("  name  ");
    expect(state.sortField).toBe("name");
    expect(service.sortField).toBe("name");
  });

  it("a missing slot passes the value on", () => {
    const { service, state } = makeService({ options: { get: {}, set: {} } });
    service.toggleRow("1");
    expect(state.selected).toEqual(new Set(["1"]));
    expect(service.selected).toEqual(new Set(["1"]));
  });
});

describe("events", () => {
  it("emits change for every write, after the set middleware", () => {
    const changes: Change<FakeFile>[] = [];
    const { service } = makeService({
      options: {
        set: { state: { sortField: (field) => field?.trim() ?? null } },
      },
    });
    service.on("change", (change) => changes.push(change));
    service.sortBy(" name ");
    expect(changes).toEqual([
      { field: "sortField", before: null, after: "name" },
      { field: "sortDirection", before: "asc", after: "asc" },
      { field: "loading", before: false, after: true },
    ]);
  });

  it("change narrows on field", () => {
    const { service } = makeService();
    const seen: string[][] = [];
    service.on("change", (change) => {
      if (change.field === "path") seen.push(change.after.map((c) => c.key));
    });
    service.open({ key: "media", label: "Media" });
    expect(seen).toEqual([["media"]]);
  });

  it("calls listeners in subscription order and unsubscribes", async () => {
    const { service } = makeService();
    const order: string[] = [];
    const off = service.on("updated", () => order.push("a"));
    service.on("updated", () => order.push("b"));
    await service.fetch();
    off();
    await service.fetch();
    expect(order).toEqual(["a", "b", "b"]);
  });

  it("a listener can unsubscribe itself during the call", async () => {
    const { service } = makeService();
    const calls = vi.fn();
    const off = service.on("updated", () => {
      calls();
      off();
    });
    await service.fetch();
    await service.fetch();
    expect(calls).toHaveBeenCalledOnce();
  });

  it("skips the change object when nothing listens", () => {
    const { service, state } = makeService();
    service.clearSelection();
    expect(state.selected).toEqual(new Set());
  });
});

describe("config defaults", () => {
  it("falls back to the default root label, locale, currency, and time zone", () => {
    const { service } = makeService();
    expect(service.rootLabel).toBe("Home");
    expect(service.locale).toBe("en-US");
    expect(service.currency).toBe("USD");
    expect(service.timeZone).toBe("UTC");
  });

  it("reads the configured root label, locale, currency, and time zone", () => {
    const { service } = makeService({
      config: {
        rootLabel: "Assets",
        locale: "de-DE",
        currency: "EUR",
        timeZone: "Europe/Berlin",
      },
    });
    expect(service.rootLabel).toBe("Assets");
    expect(service.locale).toBe("de-DE");
    expect(service.currency).toBe("EUR");
    expect(service.timeZone).toBe("Europe/Berlin");
  });

  it("carries the config key on every joined action", () => {
    const { service } = makeService({
      config: {
        actions: fakeFileActions,
        folderActions: fakeFolderActions,
        bulkActions: fakeBrowserBulkActions,
      },
    });
    expect(service.actions.map((a) => a.key)).toEqual(["download", "delete"]);
    expect(service.folderActions.map((a) => a.key)).toEqual(["rename"]);
    expect(service.bulkActions.map((a) => a.key)).toEqual(["deleteSelected"]);
  });
});

describe("trail", () => {
  it("starts at the root crumb", () => {
    const { service } = makeService();
    expect(service.trail).toEqual([{ key: "", label: "Home" }]);
  });

  it("keys each crumb by its joined path prefix", () => {
    const { service, state } = makeService({ config: { rootLabel: "Files" } });
    state.path = [
      { key: "media", label: "Media" },
      { key: "2025", label: "2025" },
      { key: "media", label: "Media" },
    ];
    expect(service.trail).toEqual([
      { key: "", label: "Files" },
      { key: "media", label: "Media" },
      { key: "media/2025", label: "2025" },
      { key: "media/2025/media", label: "Media" },
    ]);
  });

  it("indexes line up with navigate", () => {
    const { service, state } = makeService();
    state.path = [
      { key: "media", label: "Media" },
      { key: "2025", label: "2025" },
    ];
    const index = service.trail.findIndex((c) => c.key === "media");
    service.navigate(index);
    expect(service.pathKeys).toEqual(["media"]);
  });
});

describe("view deriveds", () => {
  it("reports the action and selection surfaces from the config", () => {
    const bare = makeService().service;
    expect(bare.hasActions).toBe(false);
    expect(bare.hasFolderActions).toBe(false);
    expect(bare.isSelectable).toBe(false);

    const { service } = makeService({
      config: {
        actions: fakeFileActions,
        folderActions: fakeFolderActions,
        bulkActions: fakeBrowserBulkActions,
      },
    });
    expect(service.hasActions).toBe(true);
    expect(service.hasFolderActions).toBe(true);
    expect(service.isSelectable).toBe(true);
  });

  it("tracks hasSelection with the selection", () => {
    const { service } = makeService();
    expect(service.hasSelection).toBe(false);
    service.toggleRow("1");
    expect(service.hasSelection).toBe(true);
    service.clearSelection();
    expect(service.hasSelection).toBe(false);
  });

  it("isEmpty waits for the first fetch to settle", async () => {
    const actions: Actions<FakeFile> = {
      fetch: vi.fn(async () => ({ folders: [], files: [] })),
    };
    const { service } = makeService({ actions });
    expect(service.isEmpty).toBe(false);
    const flight = service.init();
    expect(service.isEmpty).toBe(false);
    await flight;
    expect(service.isEmpty).toBe(true);
  });

  it("isEmpty is false while either section has rows", async () => {
    const { service } = makeService();
    await service.init();
    expect(service.isEmpty).toBe(false);
  });
});

describe("action dispatch", () => {
  it("runs file, folder, and bulk handlers by key", () => {
    const download = vi.fn();
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
        actions: { download },
        folderActions: { rename },
        bulkActions: { deleteSelected: purge },
      },
    });

    const row = fixture(fakeFiles.at(0));
    service.runAction("download", row);
    expect(download).toHaveBeenCalledWith(row);

    const folder = fixture(fakeFolders.at(0));
    service.runFolderAction("rename", folder);
    expect(rename).toHaveBeenCalledWith(folder);

    service.toggleRow("1");
    service.toggleRow("3");
    service.toggleFolder("media");
    service.runBulkAction("deleteSelected");
    expect(purge).toHaveBeenCalledWith(new Set(["1", "3"]), new Set(["media"]));
  });

  it("an unknown or unhandled key is a no-op", () => {
    const { service } = makeService({
      config: { actions: fakeFileActions },
    });
    expect(() =>
      service.runAction("missing", fixture(fakeFiles.at(0))),
    ).not.toThrow();
    expect(() =>
      service.runFolderAction("rename", fixture(fakeFolders.at(0))),
    ).not.toThrow();
    expect(() => service.runBulkAction("deleteSelected")).not.toThrow();
  });
});

describe("query", () => {
  it("is searchable unless the config says otherwise", () => {
    expect(makeService().service.searchable).toBe(true);
    expect(
      makeService({ config: { searchable: false } }).service.searchable,
    ).toBe(false);
  });

  it("keys one field per filterable column", () => {
    const { service } = makeService({
      config: {
        columns: [
          { key: "name", label: "Name" },
          { key: "size", label: "Size", type: "filesize", filterable: false },
          { key: "modified", label: "Modified", type: "image" },
        ],
      },
    });
    expect(service.filterableColumns.map((c) => c.key)).toEqual(["name"]);
    expect(service.query.fields).toEqual({ name: { label: "Name" } });
  });

  it("lists the sortable columns", () => {
    const { service } = makeService();
    expect(service.sortableColumns.map((c) => c.key)).toEqual(["name", "size"]);
  });

  it("hands the config's literals to the query", () => {
    const { service } = makeService({
      config: {
        literals: { text: { label: "Find", open: '"', close: '"' } },
      },
    });
    expect(service.query.items[0]?.label).toBe("Find");
  });

  it("holds its entries and draft in the browser's container", () => {
    const { service, state } = makeService();
    service.query.add({ kind: "literal", key: "text", value: "logo" });
    service.query.setDraft("Na");
    expect(state.entries).toEqual([
      { kind: "literal", key: "text", value: "logo" },
    ]);
    expect(state.draft).toBe("Na");
    expect(service.isFiltered).toBe(true);
  });

  it("a change to the entries refetches the folder it stands in and emits filtered", () => {
    const { service, state, actions, filtered } = makeService();
    state.path = [{ key: "media", label: "Media" }];

    service.query.add({ kind: "literal", key: "text", value: "logo" });
    service.query.add({ kind: "filter", key: "name", value: "hero.png" });

    expect(actions.fetch).toHaveBeenCalledTimes(2);
    expect(actions.fetch).toHaveBeenLastCalledWith(
      {
        path: ["media"],
        sortField: null,
        sortDirection: "asc",
        query: "logo",
        filters: [{ key: "name", value: "hero.png" }],
      },
      service,
    );
    expect(filtered).toHaveBeenLastCalledWith({
      id: "test-browser",
      query: "logo",
      filters: [{ key: "name", value: "hero.png" }],
    });

    service.query.clear();
    expect(service.isFiltered).toBe(false);
    expect(actions.fetch).toHaveBeenCalledTimes(3);
  });

  it("leaving the folder drops the search, in one fetch", () => {
    const { service, actions, filtered, navigated } = makeService();
    service.query.add({ kind: "literal", key: "text", value: "logo" });
    service.query.setDraft("Na");
    vi.mocked(actions.fetch).mockClear();
    filtered.mockClear();

    service.open({ key: "media", label: "Media" });

    expect(service.query.entries).toEqual([]);
    expect(service.query.draft).toBe("");
    expect(actions.fetch).toHaveBeenCalledTimes(1);
    expect(actions.fetch).toHaveBeenCalledWith(
      expect.objectContaining({ path: ["media"], query: "", filters: [] }),
      service,
    );
    expect(filtered).toHaveBeenCalledWith({
      id: "test-browser",
      query: "",
      filters: [],
    });
    expect(navigated).toHaveBeenCalledTimes(1);

    service.query.add({ kind: "literal", key: "text", value: "hero" });
    vi.mocked(actions.fetch).mockClear();
    service.navigate(0);
    expect(service.query.entries).toEqual([]);
    expect(actions.fetch).toHaveBeenCalledTimes(1);
  });

  it("a move with no search emits no filtered", () => {
    const { service, filtered } = makeService();
    service.open({ key: "media", label: "Media" });
    expect(filtered).not.toHaveBeenCalled();
  });

  it("isEmpty holds for a search with no match", async () => {
    const actions: Actions<FakeFile> = {
      fetch: vi.fn(async () => ({ folders: [], files: [] })),
    };
    const { service } = makeService({ actions });
    await service.init();
    service.query.add({ kind: "literal", key: "text", value: "zzz" });
    await Promise.resolve();
    await Promise.resolve();
    expect(service.isEmpty).toBe(true);
    expect(service.isFiltered).toBe(true);
  });
});

describe("views", () => {
  const arranged = {
    sortField: "size",
    sortDirection: "desc" as const,
    entries: [{ kind: "filter" as const, key: "name", value: "report" }],
  };

  it("snapshots the sort and the entries", () => {
    const { service } = makeService();
    service.sortBy("name");
    expect(service.snapshot()).toEqual({
      sortField: "name",
      sortDirection: "asc",
      entries: [],
    });
  });

  it("restores an arrangement in one fetch, where it stands", async () => {
    const { service, actions, filtered } = makeService();
    await service.init();
    service.open(fixture(fakeFolders[0]));
    vi.mocked(actions.fetch).mockClear();
    filtered.mockClear();
    const restored = vi.fn();
    service.on("restored", restored);

    service.restore(arranged);

    expect(actions.fetch).toHaveBeenCalledOnce();
    expect(actions.fetch).toHaveBeenCalledWith(
      {
        path: [fixture(fakeFolders[0]).key],
        sortField: "size",
        sortDirection: "desc",
        query: "",
        filters: [{ key: "name", value: "report" }],
      },
      service,
    );
    expect(filtered).toHaveBeenCalledOnce();
    expect(service.snapshot()).toEqual(arranged);
    expect(restored).toHaveBeenCalledWith({
      id: "test-browser",
      snapshot: arranged,
    });
  });

  it("fetches nothing before init", async () => {
    const { service, actions } = makeService();
    service.restore(arranged);
    expect(actions.fetch).not.toHaveBeenCalled();
    await service.init();
    expect(actions.fetch).toHaveBeenCalledOnce();
  });

  it("fetches again once the restore is done with the query", async () => {
    const { service, actions } = makeService();
    await service.init();
    service.restore(arranged);
    vi.mocked(actions.fetch).mockClear();
    service.query.clear();
    expect(actions.fetch).toHaveBeenCalledOnce();
  });
});
