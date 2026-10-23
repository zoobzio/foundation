// Gold standard: factories. `create*` splits the options once and returns the
// id-scoped composable; the tests assert that composition through the shim's
// Nuxt seams — the shared keyed container, the joined actions, the fetch
// wiring, and the hook relay — not the service's own logic.
import type { BrowserOptions } from "../../../app/types/browser";
import type { FakeFile } from "#test/data/browser";

import { describe, expect, it, vi } from "vitest";
import { useNuxtApp } from "#app";
import { createBrowser } from "../../../app/factories/browser";
import { fakeFileColumns, fakeFiles, fakeFolders } from "#test/data/browser";

const makeOptions = (
  overrides: Partial<BrowserOptions<FakeFile>> = {},
): BrowserOptions<FakeFile> => ({
  columns: fakeFileColumns,
  fileKey: "id",
  fetch: vi.fn(async () => ({ folders: fakeFolders, files: fakeFiles })),
  ...overrides,
});

describe("createBrowser", () => {
  it("returns a composable building a service over fresh store state", () => {
    const useAssets = createBrowser("assets", makeOptions());
    const assets = useAssets();
    expect(assets.id).toBe("assets");
    expect(assets.initialized).toBe(false);
    expect(assets.files).toEqual([]);
    expect(assets.path).toEqual([]);
    expect(assets.trail).toEqual([{ key: "", label: "Home" }]);
  });

  it("seeds the service from the initial state", () => {
    const assets = createBrowser(
      "assets",
      makeOptions({
        rootLabel: "Root",
        initial: {
          path: [{ key: "media", label: "Media" }],
          sortField: "size",
          sortDirection: "desc",
        },
      }),
    )();
    expect(assets.pathKeys).toEqual(["media"]);
    expect(assets.trail).toEqual([
      { key: "", label: "Root" },
      { key: "media", label: "Media" },
    ]);
    expect(assets.sortField).toBe("size");
    expect(assets.sortDirection).toBe("desc");
  });

  it("joins each action descriptor to its handler under the config key", () => {
    const download = vi.fn();
    const rename = vi.fn();
    const purge = vi.fn();
    const assets = createBrowser(
      "assets",
      makeOptions({
        actions: { download: { label: "Download", action: download } },
        folderActions: { rename: { label: "Rename", action: rename } },
        bulkActions: { purge: { label: "Purge", action: purge } },
      }),
    )();
    expect(assets.config.actions).toEqual({ download: { label: "Download" } });
    expect(assets.config.folderActions).toEqual({
      rename: { label: "Rename" },
    });
    expect(assets.config.bulkActions).toEqual({ purge: { label: "Purge" } });
    assets.runAction("download", fakeFiles[0] as FakeFile);
    expect(download).toHaveBeenCalledWith(fakeFiles[0]);
    assets.runFolderAction("rename", fakeFolders[0] as (typeof fakeFolders)[0]);
    expect(rename).toHaveBeenCalledWith(fakeFolders[0]);
    assets.toggleRow("2");
    assets.runBulkAction("purge");
    expect(purge).toHaveBeenCalledWith(new Set(["2"]));
  });

  it("init dispatches the wired fetch from the seeded trail", async () => {
    const options = makeOptions({
      initial: { path: [{ key: "media", label: "Media" }] },
    });
    const assets = createBrowser("assets", options)();
    await assets.init();
    expect(options.fetch).toHaveBeenCalledOnce();
    expect(vi.mocked(options.fetch).mock.calls.at(0)?.[0]).toEqual({
      path: ["media"],
      sortField: null,
      sortDirection: "asc",
    });
    expect(assets.files).toEqual(fakeFiles);
    expect(assets.folders.map((f) => f.key)).toEqual(["archive", "media"]);
    expect(assets.initialized).toBe(true);
  });

  it("relays service events onto the Nuxt hook bus", async () => {
    const updated = vi.fn();
    const navigated = vi.fn();
    useNuxtApp().hooks.addHooks({
      "browser:updated": updated,
      "browser:navigated": navigated,
    });
    const assets = createBrowser("assets", makeOptions())();
    await assets.init();
    expect(updated).toHaveBeenCalledWith({
      id: "assets",
      path: [],
      folders: 2,
      files: 2,
    });
    assets.open({ key: "media", label: "Media" });
    expect(navigated).toHaveBeenCalledWith({ id: "assets", path: ["media"] });
  });

  it("every call of one composable shares the id's state", async () => {
    const useAssets = createBrowser("assets", makeOptions());
    const a = useAssets();
    const b = useAssets();
    expect(a).not.toBe(b);
    await a.init();
    a.open({ key: "media", label: "Media" });
    expect(b.files).toEqual(fakeFiles);
    expect(b.pathKeys).toEqual(["media"]);
  });

  it("different ids stay independent", async () => {
    const a = createBrowser("assets", makeOptions())();
    const b = createBrowser("uploads", makeOptions())();
    await a.init();
    expect(b.initialized).toBe(false);
    expect(b.files).toEqual([]);
  });
});
