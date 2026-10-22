import type { BrowserFoldersProps } from "../../src/types/components/browser-folders";
import type { FakeFile } from "#test/data/browser";

import { afterEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import BrowserFolders from "../../src/components/browser-folders.vue";
import { makeBrowser } from "#test/mount/browser";
import { fakeBrowserBulkActions, fakeFolderActions } from "#test/data/browser";

const mounted: { unmount: () => void }[] = [];

const mountFolders = (
  props: BrowserFoldersProps<FakeFile>,
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(BrowserFolders<FakeFile>, { props, slots });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
});

describe("browser-folders", () => {
  it("renders one row per folder with the label spanning the data columns", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountFolders({ service });
    const rows = wrapper.findAll("tr");
    expect(rows).toHaveLength(3);
    expect(rows.map((tr) => tr.get(".f-span").text())).toEqual([
      "Archive",
      "Drafts",
      "Media",
    ]);
    expect(rows[0]!.get("td").attributes("colspan")).toBe("3");
    expect(wrapper.find(".f-data-browser-select").exists()).toBe(false);
    expect(wrapper.find(".f-data-browser-actions").exists()).toBe(false);
  });

  it("shows the count badge only when the folder carries one", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountFolders({ service });
    const rows = wrapper.findAll("tr");
    expect(rows[0]!.find(".f-data-browser-folder-count").exists()).toBe(false);
    expect(rows[2]!.get(".f-data-browser-folder-count").text()).toBe("12");
  });

  it("keeps an empty selection cell for alignment when files are selectable", async () => {
    const { service } = makeBrowser(
      { bulkActions: fakeBrowserBulkActions },
      { bulkActions: { purge: vi.fn() } },
    );
    await service.init();
    const wrapper = mountFolders({ service });
    const select = wrapper.findAll("td.f-data-browser-select");
    expect(select).toHaveLength(3);
    expect(select[0]!.find('[role="checkbox"]').exists()).toBe(false);
  });

  it("opens a folder through the service", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountFolders({ service });
    const drafts = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Drafts"));
    if (!drafts) throw new Error("no Drafts folder");
    await drafts.trigger("click");
    expect(service.path).toEqual([{ key: "drafts", label: "Drafts" }]);
  });

  it("renders the folder actions trigger per row when folder actions exist", async () => {
    const { service } = makeBrowser(
      { folderActions: fakeFolderActions },
      { folderActions: { rename: vi.fn() } },
    );
    await service.init();
    const wrapper = mountFolders(
      { service },
      {
        folderActionsIcon: `<template #folderActionsIcon="s"><i>{{ s.folder.key }}</i></template>`,
      },
    );
    const triggers = wrapper.findAll('button[aria-label="Actions"]');
    expect(triggers.map((t) => t.get("i").text())).toEqual([
      "archive",
      "drafts",
      "media",
    ]);
    expect(triggers[0]!.find(".f-span").exists()).toBe(false);
  });

  it("serves ctx and the folder to the folder slot", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountFolders(
      { service },
      {
        folder: `<template #folder="s"><output>{{ s.folder.key }}:{{ s.browser.id }}</output></template>`,
      },
    );
    expect(wrapper.findAll("output").map((o) => o.text())).toEqual([
      "archive:test-browser",
      "drafts:test-browser",
      "media:test-browser",
    ]);
    expect(wrapper.findAll("button")).toHaveLength(0);
  });
});
