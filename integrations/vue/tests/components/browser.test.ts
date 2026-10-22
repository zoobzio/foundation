import type { BrowserProps } from "../../src/types/components/browser";
import type { BrowserFetchResult } from "@zoobzio/browser";
import type { FakeFile } from "#test/data/browser";

import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Browser from "../../src/components/browser.vue";
import { makeBrowser } from "#test/mount/browser";
import {
  fakeBrowserBulkActions,
  fakeFileActions,
  fakeFiles,
  fakeFolderActions,
  fakeFolders,
} from "#test/data/browser";

const mounted: { unmount: () => void }[] = [];

const mountBrowser = (
  props: BrowserProps<FakeFile>,
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(Browser<FakeFile>, {
    props,
    slots,
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

const menuItem = (label: string) =>
  Array.from(
    document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  ).find((el) => el.textContent?.includes(label));

describe("browser", () => {
  it("renders the listing before init and the rows after", async () => {
    const { service } = makeBrowser();
    const wrapper = mountBrowser({ service });
    expect(wrapper.find(".f-data-browser-empty").exists()).toBe(false);
    expect(wrapper.get(".f-data-browser-no-files").text()).toBe("No files");
    await service.init();
    await flushPromises();
    expect(wrapper.findAll(".f-data-browser-folders tr")).toHaveLength(3);
    expect(wrapper.findAll(".f-data-browser-files tr")).toHaveLength(3);
  });

  it("renders folders alphabetically above the files in one headerless table", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountBrowser({ service });
    const table = wrapper.get("table.f-table");
    expect(table.find("thead").exists()).toBe(false);
    expect(
      table.findAll(".f-data-browser-folder .f-span").map((s) => s.text()),
    ).toEqual(["Archive", "Drafts", "Media"]);
    const first = table.findAll(".f-data-browser-files tr").at(0);
    if (!first) throw new Error("no file rows");
    expect(first.findAll("td").map((td) => td.text())).toEqual([
      "logo.svg",
      "2 kB",
      "Jan 15, 2025",
    ]);
  });

  it("swaps the body for the empty state once an empty folder settles", async () => {
    const { service } = makeBrowser({}, {}, { folders: [], files: [] });
    const wrapper = mountBrowser({ service });
    expect(wrapper.find("table.f-table").exists()).toBe(true);
    await service.init();
    await flushPromises();
    expect(wrapper.get(".f-data-browser-empty").text()).toBe("Empty folder");
    expect(wrapper.find("table.f-table").exists()).toBe(false);
  });

  it("hides the folders section when the folder has no subfolders", async () => {
    const { service } = makeBrowser({}, {}, { folders: [], files: [] });
    await service.init();
    const wrapper = mountBrowser({ service });
    expect(wrapper.find(".f-data-browser-empty").exists()).toBe(true);
    const listed = makeBrowser(
      {},
      {},
      {
        folders: [],
        files: [{ id: 9, name: "a", size: 1, modified: "2025-01-01T12:00:00" }],
      },
    );
    await listed.service.init();
    const shown = mountBrowser({ service: listed.service });
    expect(shown.find(".f-data-browser-folders").exists()).toBe(false);
    expect(shown.findAll(".f-data-browser-files tr")).toHaveLength(1);
  });

  it("opens a folder through the service and grows the trail", async () => {
    const { service, fetch } = makeBrowser();
    await service.init();
    const wrapper = mountBrowser({ service });
    const media = wrapper
      .findAll(".f-data-browser-folder-btn")
      .find((b) => b.text().includes("Media"));
    if (!media) throw new Error("no Media folder");
    await media.trigger("click");
    await flushPromises();
    expect(service.pathKeys).toEqual(["media"]);
    expect(fetch).toHaveBeenLastCalledWith(
      expect.objectContaining({ path: ["media"] }),
      service,
    );
    const crumbs = wrapper.get(".f-data-browser-breadcrumb");
    expect(crumbs.findAll("li").map((li) => li.text())).toEqual([
      "Home",
      "Media",
    ]);
    expect(crumbs.get('[aria-current="page"]').text()).toBe("Media");
  });

  it("navigates to an ancestor through its crumb", async () => {
    const { service } = makeBrowser({ rootLabel: "Assets" });
    await service.init();
    service.open({ key: "media", label: "Media" });
    service.open({ key: "2025", label: "2025" });
    await flushPromises();
    const wrapper = mountBrowser({ service });
    const crumbs = wrapper.get(".f-data-browser-breadcrumb");
    expect(crumbs.findAll("li").map((li) => li.text())).toEqual([
      "Assets",
      "Media",
      "2025",
    ]);
    const media = crumbs.findAll("button").find((b) => b.text() === "Media");
    if (!media) throw new Error("no Media crumb");
    await media.trigger("click");
    expect(service.pathKeys).toEqual(["media"]);
    const root = wrapper
      .get(".f-data-browser-breadcrumb")
      .findAll("button")
      .find((b) => b.text() === "Assets");
    if (!root) throw new Error("no root crumb");
    await root.trigger("click");
    expect(service.pathKeys).toEqual([]);
  });

  it("refetches the current folder from the refresh control", async () => {
    const { service, fetch } = makeBrowser();
    await service.init();
    const wrapper = mountBrowser({ service });
    const refresh = wrapper.get('button[aria-label="Refresh"]');
    expect(refresh.text()).toBe("Refresh");
    await refresh.trigger("click");
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("selects files and shows the bulk actions bar", async () => {
    const purge = vi.fn();
    const { service } = makeBrowser(
      { bulkActions: fakeBrowserBulkActions },
      { bulkActions: { purge } },
    );
    await service.init();
    const wrapper = mountBrowser({ service });
    expect(wrapper.find(".f-data-browser-bulk-actions").exists()).toBe(false);
    // Folder rows keep an empty selection cell so the columns line up.
    expect(
      wrapper.findAll(".f-data-browser-folders td.f-data-browser-select"),
    ).toHaveLength(3);
    const checkboxes = wrapper.findAll(
      '.f-data-browser-files [role="checkbox"]',
    );
    expect(checkboxes).toHaveLength(3);
    await checkboxes[0]!.trigger("click");
    await flushPromises();
    expect(service.selected).toEqual(new Set(["1"]));
    const bar = wrapper.get(".f-data-browser-bulk-actions");
    expect(bar.text()).toContain("1 selected");
    await bar.get(".f-data-browser-bulk-action").trigger("click");
    expect(purge).toHaveBeenCalledWith(new Set(["1"]));
    await bar.get(".f-data-browser-bulk-action-clear").trigger("click");
    expect(service.selected.size).toBe(0);
  });

  it("dispatches a file action by key from the row menu", async () => {
    const download = vi.fn();
    const { service } = makeBrowser(
      { actions: fakeFileActions },
      { actions: { download, remove: vi.fn() } },
    );
    await service.init();
    const wrapper = mountBrowser({ service });
    const cells = wrapper.findAll(
      ".f-data-browser-files td.f-data-browser-actions",
    );
    expect(cells).toHaveLength(3);
    // The folder rows keep the trailing cell, without a menu of their own.
    const folderCells = wrapper.findAll(
      ".f-data-browser-folders td.f-data-browser-actions",
    );
    expect(folderCells).toHaveLength(3);
    expect(folderCells[0]!.find("button").exists()).toBe(false);
    await cells[0]!.get("button.f-button").trigger("click", {
      button: 0,
      ctrlKey: false,
    });
    await flushPromises();
    const item = menuItem("Download");
    if (!item) throw new Error("no rendered Download item");
    item.click();
    await flushPromises();
    expect(download).toHaveBeenCalledWith(service.files[0]);
  });

  it("dispatches a folder action by key from the folder menu", async () => {
    const rename = vi.fn();
    const { service } = makeBrowser(
      { folderActions: fakeFolderActions },
      { folderActions: { rename } },
    );
    await service.init();
    const wrapper = mountBrowser({ service });
    const cells = wrapper.findAll(
      ".f-data-browser-folders td.f-data-browser-actions",
    );
    expect(cells).toHaveLength(3);
    // The file rows keep the trailing cell, without a menu of their own.
    const fileCells = wrapper.findAll(
      ".f-data-browser-files td.f-data-browser-actions",
    );
    expect(fileCells).toHaveLength(3);
    expect(fileCells[0]!.find("button").exists()).toBe(false);
    await cells[0]!.get("button.f-button").trigger("click", {
      button: 0,
      ctrlKey: false,
    });
    await flushPromises();
    const item = menuItem("Rename");
    if (!item) throw new Error("no rendered Rename item");
    item.click();
    await flushPromises();
    expect(rename).toHaveBeenCalledWith(service.folders[0]);
    expect(service.folders[0]?.label).toBe("Archive");
  });

  it("cascades cell slots: key beats type beats catch-all", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountBrowser(
      { service },
      {
        "cell:name": "<em>by-key</em>",
        "cell:filesize": "<em>by-type</em>",
        cell: "<em>all</em>",
      },
    );
    const first = wrapper.findAll(".f-data-browser-files tr").at(0);
    if (!first) throw new Error("no file rows");
    expect(first.findAll("td").map((td) => td.text())).toEqual([
      "by-key",
      "by-type",
      "all",
    ]);
  });

  it("relays folder, file, and bulk action slots from the top", async () => {
    const { service } = makeBrowser(
      { bulkActions: fakeBrowserBulkActions },
      { bulkActions: { purge: vi.fn() } },
    );
    await service.init();
    service.toggleRow("1");
    const wrapper = mountBrowser(
      { service },
      {
        folderIcon: `<template #folderIcon="s"><i>{{ s.folder.key }}</i></template>`,
        bulkActionIcon: `<template #bulkActionIcon="s"><b>{{ s.action.label }}</b></template>`,
        actionsIcon: `<template #actionsIcon="s"><u>{{ s.row.name }}</u></template>`,
      },
    );
    await flushPromises();
    expect(
      wrapper.findAll(".f-data-browser-folder-btn i").map((i) => i.text()),
    ).toEqual(["archive", "drafts", "media"]);
    expect(wrapper.get(".f-data-browser-bulk-action b").text()).toBe("Purge");
  });

  it("serves the files context to the noFiles slot", async () => {
    const { service } = makeBrowser(
      {},
      {},
      { folders: fakeFolders, files: [] },
    );
    await service.init();
    const wrapper = mountBrowser(
      { service },
      {
        noFiles: `<template #noFiles="s"><output>{{ s.browser.id }}</output></template>`,
      },
    );
    expect(wrapper.get(".f-data-browser-no-files output").text()).toBe(
      "test-browser",
    );
  });

  it("relays the service's domain events as emits", async () => {
    const { service } = makeBrowser();
    const wrapper = mountBrowser({ service });
    await service.init();
    service.open({ key: "media", label: "Media" });
    await flushPromises();
    expect(wrapper.emitted("updated")?.at(0)).toEqual([
      { id: "test-browser", path: [], folders: 3, files: 3 },
    ]);
    expect(wrapper.emitted("navigated")?.at(0)).toEqual([
      { id: "test-browser", path: ["media"] },
    ]);
  });

  it("marks the root while a fetch is in flight", async () => {
    const box: { resolve?: (r: BrowserFetchResult<FakeFile>) => void } = {};
    const { service } = makeBrowser(
      {},
      {
        fetch: vi.fn(
          () =>
            new Promise<BrowserFetchResult<FakeFile>>((res) => {
              box.resolve = res;
            }),
        ),
      },
    );
    const wrapper = mountBrowser({ service });
    const flight = service.init();
    await flushPromises();
    expect(wrapper.get(".f-data-browser").classes()).toContain(
      "f-data-browser-loading",
    );
    box.resolve?.({ folders: fakeFolders, files: fakeFiles });
    await flight;
    await flushPromises();
    expect(wrapper.get(".f-data-browser").classes()).not.toContain(
      "f-data-browser-loading",
    );
  });

  it("pt overrides reach their part and the row sections", async () => {
    const { service } = makeBrowser(
      { actions: fakeFileActions },
      { actions: { download: vi.fn(), remove: vi.fn() } },
    );
    await service.init();
    const wrapper = mountBrowser({
      service,
      pt: {
        refresh: { label: "Reload" },
        files: { actionsTrigger: { label: "More" } },
      },
    });
    expect(wrapper.find('button[aria-label="Reload"]').exists()).toBe(true);
    expect(wrapper.findAll('button[aria-label="More"]')).toHaveLength(3);
  });

  it("the empty slot replaces the whole body", async () => {
    const { service } = makeBrowser({}, {}, { folders: [], files: [] });
    await service.init();
    const wrapper = mountBrowser(
      { service },
      {
        empty: `<template #empty="s"><p>{{ s.browser.id }} is empty</p></template>`,
      },
    );
    expect(wrapper.get("p").text()).toBe("test-browser is empty");
    expect(wrapper.find("table").exists()).toBe(false);
  });
});
