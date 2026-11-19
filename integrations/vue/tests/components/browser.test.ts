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

  it("renders folders above the files in one table, in the fetch's order", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountBrowser({ service });
    const table = wrapper.get("table.f-table");
    expect(
      table.findAll(".f-data-browser-folder-btn .f-span").map((s) => s.text()),
    ).toEqual(["Archive", "Drafts", "Media"]);
    const first = table.findAll(".f-data-browser-files tr").at(0);
    if (!first) throw new Error("no file rows");
    expect(first.findAll("td").map((td) => td.text())).toEqual([
      "logo.svg",
      "2 kB",
      "Jan 15, 2025",
    ]);
  });

  it("swaps the rows for the empty state under the head once an empty folder settles", async () => {
    const { service } = makeBrowser({}, {}, { folders: [], files: [] });
    const wrapper = mountBrowser({ service });
    expect(wrapper.find(".f-data-browser-empty").exists()).toBe(false);
    await service.init();
    await flushPromises();
    const empty = wrapper.get("table.f-table tbody.f-data-browser-empty");
    expect(empty.text()).toBe("Empty folder");
    expect(empty.get("td").attributes("colspan")).toBe("3");
    expect(wrapper.find(".f-data-browser-files").exists()).toBe(false);
    expect(wrapper.find("thead .f-data-browser-breadcrumb").exists()).toBe(
      true,
    );
  });

  it("names a search with no match apart from an empty folder", async () => {
    const { service } = makeBrowser({}, {}, { folders: [], files: [] });
    await service.init();
    const wrapper = mountBrowser({ service });
    service.query.add({ kind: "literal", key: "text", value: "zzz" });
    await flushPromises();
    expect(wrapper.get(".f-data-browser-empty").text()).toBe("No matches");
  });

  it("attaches the trail and the listing's counts to the table as its head", async () => {
    const { service } = makeBrowser(
      { actions: fakeFileActions },
      { actions: { download: vi.fn(), remove: vi.fn() } },
    );
    const wrapper = mountBrowser({ service });
    const head = wrapper.get("table.f-table thead.f-data-browser-head");
    expect(head.findAll("th")).toHaveLength(1);
    // The columns and the actions column.
    expect(head.get("th").attributes("colspan")).toBe("4");
    expect(head.find(".f-data-browser-breadcrumb").exists()).toBe(true);
    expect(wrapper.find(".f-data-browser-toolbar nav").exists()).toBe(false);
    // Nothing is counted before the first fetch settles.
    expect(head.find(".f-data-browser-summary").exists()).toBe(false);
    await service.init();
    await flushPromises();
    expect(head.get(".f-data-browser-summary").text()).toBe(
      "3 folders, 3 files",
    );
  });

  it("selects every file from the head's checkbox", async () => {
    const { service } = makeBrowser(
      { bulkActions: fakeBrowserBulkActions },
      { bulkActions: { purge: vi.fn() } },
    );
    await service.init();
    const wrapper = mountBrowser({ service });
    const all = wrapper.get('thead th.f-data-browser-select [role="checkbox"]');
    expect(wrapper.get("thead").findAll("th")).toHaveLength(2);
    await all.trigger("click");
    await flushPromises();
    expect(service.selected).toEqual(new Set(["1", "2", "3"]));
    service.toggleRow("1");
    await flushPromises();
    expect(all.attributes("aria-checked")).toBe("mixed");
  });

  it("relays the head's slots from the top", async () => {
    const { service } = makeBrowser();
    await service.init();
    service.open({ key: "media", label: "Media" });
    await flushPromises();
    const wrapper = mountBrowser(
      { service },
      {
        crumbPrepend: `<template #crumbPrepend="s"><i>{{ s.index }}{{ s.last ? "!" : "" }}</i></template>`,
        summary: `<template #summary="s"><b>{{ s.browser.files.length }}</b></template>`,
      },
    );
    expect(
      wrapper.findAll(".f-data-browser-breadcrumb i").map((i) => i.text()),
    ).toEqual(["0", "1!"]);
    expect(wrapper.get(".f-data-browser-summary b").text()).toBe("3");
  });

  it("submits quoted search text as the service query", async () => {
    const { service, fetch } = makeBrowser();
    const wrapper = mountBrowser({ service });
    const input = wrapper.get(".f-data-browser-search input");
    expect(input.attributes("placeholder")).toBe("Search...");
    await input.setValue('"logo');
    await input.trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(service.query.text).toBe("logo");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenLastCalledWith(
      expect.objectContaining({ path: [], query: "logo" }),
      service,
    );
    expect(wrapper.emitted("filtered")?.at(0)).toEqual([
      { id: "test-browser", query: "logo", filters: [] },
    ]);
  });

  it("drops the search on opening a folder", async () => {
    const { service } = makeBrowser();
    await service.init();
    service.query.add({ kind: "literal", key: "text", value: "logo" });
    const wrapper = mountBrowser({ service });
    await flushPromises();
    expect(wrapper.findAll(".f-chip")).toHaveLength(1);
    await wrapper.get(".f-data-browser-folder-btn").trigger("click");
    await flushPromises();
    expect(wrapper.findAll(".f-chip")).toHaveLength(0);
    expect(service.query.text).toBe("");
  });

  it("hides the search when the config says so", () => {
    const { service } = makeBrowser({ searchable: false });
    const wrapper = mountBrowser({ service });
    expect(wrapper.find(".f-data-browser-search").exists()).toBe(false);
  });

  it("sorts the files from the sort menu, flipping on a repeat", async () => {
    const { service, fetch } = makeBrowser();
    await service.init();
    const wrapper = mountBrowser({ service });
    const trigger = wrapper.get('button[aria-label="Sort"]');
    const pick = async (label: string) => {
      await trigger.trigger("click", { button: 0, ctrlKey: false });
      await flushPromises();
      const item = menuItem(label);
      if (!item) throw new Error(`no rendered ${label} item`);
      return item;
    };
    const size = await pick("Size");
    // The sortable columns alone.
    expect(menuItem("Modified")).toBeUndefined();
    expect(size.hasAttribute("data-current")).toBe(false);
    size.click();
    await flushPromises();
    expect(service.sortField).toBe("size");
    expect(service.sortDirection).toBe("asc");
    expect(fetch).toHaveBeenLastCalledWith(
      expect.objectContaining({ sortField: "size", sortDirection: "asc" }),
      service,
    );
    const again = await pick("Size");
    expect(again.hasAttribute("data-current")).toBe(true);
    expect(again.getAttribute("data-direction")).toBe("asc");
    again.click();
    await flushPromises();
    expect(service.sortDirection).toBe("desc");
  });

  it("renders no sort menu without a sortable column", () => {
    const { service } = makeBrowser({
      columns: [{ key: "name", label: "Name" }],
    });
    const wrapper = mountBrowser({ service });
    expect(wrapper.find('button[aria-label="Sort"]').exists()).toBe(false);
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

  it("renders a crumb with a link as an anchor that still navigates", async () => {
    const { service, state } = makeBrowser({ rootLink: { to: "/files" } });
    state.path = [{ key: "media", label: "Media" }];
    await service.init();
    const wrapper = mountBrowser({ service });
    const root = wrapper.find(".f-data-browser-breadcrumb a.f-anchor");
    expect(root.attributes("href")).toBe("/files");
    await root.trigger("click");
    expect(service.pathKeys).toEqual([]);
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

  it("refreshes from a menu where the browser has a sync", async () => {
    const refresh = vi.fn(async () => false);
    const { service, fetch } = makeBrowser({}, { refresh });
    await service.init();
    const wrapper = mountBrowser({ service });
    const root = wrapper.get(".f-data-browser");
    const trigger = wrapper.get('button[aria-label="Refresh"]');
    const pick = async (label: string) => {
      await trigger.trigger("click", { button: 0, ctrlKey: false });
      await flushPromises();
      const item = menuItem(label);
      if (!item) throw new Error(`no rendered ${label} item`);
      return item;
    };
    // The button opens the menu: it fetches nothing itself.
    const off = await pick("Off");
    expect(fetch).toHaveBeenCalledOnce();
    expect(off.hasAttribute("data-current")).toBe(true);
    expect(root.classes()).not.toContain("f-data-browser-live");
    expect(menuItem("Every 10 seconds")).toBeDefined();
    expect(menuItem("Every 5 minutes")).toBeDefined();

    const thirty = menuItem("Every 30 seconds");
    thirty?.click();
    await flushPromises();
    expect(service.sync?.interval).toBe(30_000);
    expect(root.classes()).toContain("f-data-browser-live");
    expect((await pick("Every 30 seconds")).hasAttribute("data-current")).toBe(
      true,
    );
    expect(menuItem("Off")?.hasAttribute("data-current")).toBe(false);

    menuItem("Refresh now")?.click();
    await flushPromises();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("keeps the browser alive on the interval while it is mounted", async () => {
    vi.useFakeTimers();
    try {
      const refresh = vi.fn(async () => false);
      const { service } = makeBrowser(
        { sync: { interval: 10_000 } },
        { refresh },
      );
      service.sync?.setInterval(10_000);
      await service.init();
      const wrapper = mountBrowser({ service });
      await vi.advanceTimersByTimeAsync(10_000);
      expect(refresh).toHaveBeenCalledOnce();
      wrapper.unmount();
      await vi.advanceTimersByTimeAsync(60_000);
      expect(refresh).toHaveBeenCalledOnce();
    } finally {
      vi.useRealTimers();
    }
  });

  it("relays the sync menu's item slots", async () => {
    const { service } = makeBrowser({}, { refresh: vi.fn() });
    await service.init();
    const wrapper = mountBrowser(
      { service },
      {
        syncPrepend: `<template #syncPrepend="{ item }"><i>{{ item.key }}</i></template>`,
        syncLabel: `<template #syncLabel="{ item }"><b>{{ item.interval ?? "go" }}</b></template>`,
        syncAppend: `<template #syncAppend><u>!</u></template>`,
      },
    );
    await wrapper
      .get('button[aria-label="Refresh"]')
      .trigger("click", { button: 0, ctrlKey: false });
    await flushPromises();
    const items = Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    expect(items.map((el) => el.textContent?.trim())).toEqual([
      "nowgo!",
      "off0!",
      "1000010000!",
      "3000030000!",
      "6000060000!",
      "300000300000!",
    ]);
  });

  it("selects files and folders and shows the bulk actions bar", async () => {
    const purge = vi.fn();
    const { service } = makeBrowser(
      { bulkActions: fakeBrowserBulkActions },
      { bulkActions: { purge } },
    );
    await service.init();
    const wrapper = mountBrowser({ service });
    expect(wrapper.find(".f-data-browser-bulk-actions").exists()).toBe(false);
    const folders = wrapper.findAll(
      '.f-data-browser-folders [role="checkbox"]',
    );
    expect(folders).toHaveLength(3);
    const checkboxes = wrapper.findAll(
      '.f-data-browser-files [role="checkbox"]',
    );
    expect(checkboxes).toHaveLength(3);
    await checkboxes[0]!.trigger("click");
    await flushPromises();
    expect(service.selected).toEqual(new Set(["1"]));
    const bar = wrapper.get(".f-data-browser-bulk-actions");
    expect(bar.text()).toContain("1 selected");
    await folders[0]!.trigger("click");
    await flushPromises();
    expect(service.selectedFolders).toEqual(new Set(["archive"]));
    expect(bar.text()).toContain("2 selected");
    await bar.get(".f-data-browser-bulk-action").trigger("click");
    expect(purge).toHaveBeenCalledWith(new Set(["1"]), new Set(["archive"]));
    await bar.get(".f-data-browser-bulk-action-clear").trigger("click");
    expect(service.hasSelection).toBe(false);
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

  it("relays the folder, bulk action, and refresh slots from the top", async () => {
    const { service } = makeBrowser(
      { bulkActions: fakeBrowserBulkActions },
      { bulkActions: { purge: vi.fn() } },
    );
    await service.init();
    service.toggleRow("1");
    const wrapper = mountBrowser(
      { service },
      {
        folderPrepend: `<template #folderPrepend="s"><i>{{ s.folder.key }}</i></template>`,
        bulkActionPrepend: `<template #bulkActionPrepend="s"><b>{{ s.action.label }}</b></template>`,
        refresh: `<template #refresh><u>refresh</u></template>`,
      },
    );
    await flushPromises();
    expect(
      wrapper.findAll(".f-data-browser-folder-btn i").map((i) => i.text()),
    ).toEqual(["archive", "drafts", "media"]);
    expect(wrapper.get(".f-data-browser-bulk-action b").text()).toBe("Purge");
    expect(wrapper.get("u").text()).toBe("refresh");
    expect(wrapper.find('button[aria-label="Refresh"]').exists()).toBe(false);
  });

  it("relays the bulkClear slot from the top", async () => {
    const { service } = makeBrowser(
      { bulkActions: fakeBrowserBulkActions },
      { bulkActions: { purge: vi.fn() } },
    );
    await service.init();
    service.toggleRow("1");
    const wrapper = mountBrowser(
      { service },
      { bulkClear: `<template #bulkClear><u>clear</u></template>` },
    );
    await flushPromises();
    expect(wrapper.get(".f-data-browser-bulk-action-clear u").text()).toBe(
      "clear",
    );
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
        search: { placeholder: "Find" },
        sortTrigger: { label: "Order" },
        head: {
          breadcrumb: { items: [{ key: "top", label: "Top", index: 0 }] },
        },
        files: { actionsTrigger: { label: "More" } },
      },
    });
    expect(
      wrapper.get(".f-data-browser-search input").attributes("placeholder"),
    ).toBe("Find");
    expect(wrapper.find('button[aria-label="Order"]').exists()).toBe(true);
    expect(wrapper.get(".f-data-browser-breadcrumb").text()).toBe("Top");
    expect(wrapper.find('button[aria-label="Reload"]').exists()).toBe(true);
    expect(wrapper.findAll('button[aria-label="More"]')).toHaveLength(3);
  });

  it("the empty slot fills the body under the head", async () => {
    const { service } = makeBrowser({}, {}, { folders: [], files: [] });
    await service.init();
    const wrapper = mountBrowser(
      { service },
      {
        empty: `<template #empty="s"><p>{{ s.browser.id }} is empty</p></template>`,
      },
    );
    expect(wrapper.get("tbody.f-data-browser-empty td p").text()).toBe(
      "test-browser is empty",
    );
    expect(wrapper.find("thead").exists()).toBe(true);
  });
});
