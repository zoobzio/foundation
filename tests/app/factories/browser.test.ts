// Widget-composable test in the factories/table.test.ts mold — asserts the
// composition of store + service through the shim's Nuxt seams: live
// reactive views over shared keyed state, not re-tested service logic
// (that depth lives in tests/app/services/browser.test.ts).
import { describe, expect, it, vi } from "vitest";
import { toValue } from "vue";
import { useBrowser } from "../../../app/factories/browser";
import type { BrowserFetchResult } from "../../../app/types/data/browser";
import {
  fakeFileColumns,
  fakeFiles,
  fakeFolders,
} from "#test/data/browser";
import type { FakeFile } from "#test/data/browser";

const makeWiring = () => ({
  fetch: vi.fn(
    async (): Promise<BrowserFetchResult<FakeFile>> => ({
      folders: fakeFolders,
      files: fakeFiles,
    }),
  ),
});

const definition = { columns: fakeFileColumns, fileKey: "id" as const };

describe("useBrowser", () => {
  it("yields the widget triple resolving pt into settings", () => {
    const widget = useBrowser(
      "b1",
      { ...definition, pt: { refresh: { label: "assets" } } },
      makeWiring(),
    );
    expect(widget.component).toBeDefined();
    expect(toValue(widget.settings)).toEqual({
      refresh: { label: "assets" },
    });
  });

  it("merges wiring pt over the definition base per key", () => {
    const widget = useBrowser(
      "b1",
      {
        ...definition,
        pt: { refresh: { label: "base" }, scroller: { scrollHideDelay: 300 } },
      },
      { ...makeWiring(), pt: { refresh: { label: "override" } } },
    );
    expect(toValue(widget.settings)).toEqual({
      refresh: { label: "override" },
      scroller: { scrollHideDelay: 300 },
    });
  });

  it("joins the three handler records to their descriptors by key", () => {
    const download = vi.fn();
    const rename = vi.fn();
    const purge = vi.fn();
    const browser = useBrowser(
      "b1",
      {
        ...definition,
        actions: { download: { icon: "download", label: "Download" } },
        folderActions: { rename: { icon: "edit", label: "Rename" } },
        bulkActions: { purge: { icon: "delete", label: "Purge" } },
      },
      {
        ...makeWiring(),
        actions: { download },
        folderActions: { rename },
        bulkActions: { purge },
      },
    ).service;

    const row = fakeFiles.at(0);
    if (!row) throw new Error("fakeFiles is empty");
    browser.actions.at(0)?.action(row);
    expect(download).toHaveBeenCalledWith(row);

    const folder = fakeFolders.at(0);
    if (!folder) throw new Error("fakeFolders is empty");
    browser.folderActions.at(0)?.action(folder);
    expect(rename).toHaveBeenCalledWith(folder);

    browser.bulkActions.at(0)?.action(new Set(["1"]));
    expect(purge).toHaveBeenCalledWith(new Set(["1"]));
  });

  it("builds a browser over fresh store state", () => {
    const browser = useBrowser("b1", definition, makeWiring()).service;
    expect(browser.id).toBe("b1");
    expect(browser.folders).toEqual([]);
    expect(browser.files).toEqual([]);
    expect(browser.initialized).toBe(false);
    expect(browser.pathKeys).toEqual([]);
  });

  it("init drives the fetch pipeline into the reactive views", async () => {
    const browser = useBrowser("b1", definition, makeWiring()).service;
    await browser.init();
    expect(browser.files).toEqual(fakeFiles);
    expect(browser.folders.map((f) => f.label)).toEqual([
      "Archive",
      "Drafts",
      "Media",
    ]);
    expect(browser.initialized).toBe(true);
  });

  it("returned refs track service mutations", async () => {
    const browser = useBrowser("b1", definition, makeWiring()).service;
    await browser.init();
    browser.open({ key: "media", label: "Media" });
    expect(browser.pathKeys).toEqual(["media"]);
    browser.sortBy("name");
    expect(browser.sortField).toBe("name");
    browser.toggleRow("1");
    expect(browser.selectAllState).toBe("indeterminate");
  });

  it("same id shares state across instances", async () => {
    const a = useBrowser("b1", definition, makeWiring()).service;
    const b = useBrowser("b1", definition, makeWiring()).service;
    await a.init();
    a.open({ key: "media", label: "Media" });
    expect(b.pathKeys).toEqual(["media"]);
    expect(b.files).toEqual(fakeFiles);
  });

  it("different ids stay independent", async () => {
    const a = useBrowser("b1", definition, makeWiring()).service;
    const b = useBrowser("b2", definition, makeWiring()).service;
    await a.init();
    expect(b.initialized).toBe(false);
    expect(b.files).toEqual([]);
  });
});
