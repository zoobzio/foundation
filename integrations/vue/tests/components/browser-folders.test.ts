import type { BrowserFoldersProps } from "../../src/types/components/browser-folders";
import type { FakeFile } from "#test/data/browser";

import { afterEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import BrowserFolders from "../../src/components/browser-folders.vue";
import { makeBrowser } from "#test/mount/browser";
import { fakeBrowserBulkActions } from "#test/data/browser";

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
  it("renders one row per folder with a cell per column and the label in the first column", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountFolders({ service });
    const rows = wrapper.findAll("tr");
    expect(rows).toHaveLength(3);
    expect(
      rows.map((tr) => tr.get(".f-data-browser-folder-btn .f-span").text()),
    ).toEqual(["Archive", "Drafts", "Media"]);
    for (const row of rows) {
      const cells = row.findAll("td");
      expect(cells).toHaveLength(3);
      expect(cells[0]!.attributes("colspan")).toBeUndefined();
      expect(cells[0]!.find(".f-data-browser-folder-btn").exists()).toBe(true);
      expect(cells[1]!.find(".f-data-browser-folder-btn").exists()).toBe(false);
    }
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

  it("formats a folder's values in their columns and leaves the rest empty", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountFolders({ service });
    const rows = wrapper.findAll("tr");
    // Archive carries no values; Media a size alone.
    expect(rows[0]!.findAll("td").map((td) => td.text())).toEqual([
      "Archive",
      "",
      "",
    ]);
    const media = rows[2]!.findAll("td");
    expect(media[1]!.text()).toBe("4 kB");
    expect(media[2]!.text()).toBe("");
  });

  it("cascades the folder cell slots: key, then type, then every cell", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountFolders(
      { service },
      {
        "folderCell:size": `<template #folderCell:size="s"><output>key:{{ s.folder.key }}:{{ s.value }}</output></template>`,
        "folderCell:filesize": `<template #folderCell:filesize>type</template>`,
        "folderCell:date": `<template #folderCell:date="s"><output>type:{{ s.column.key }}</output></template>`,
        folderCell: `<template #folderCell>any</template>`,
      },
    );
    const media = wrapper.findAll("tr")[2]!.findAll("td");
    expect(media[0]!.find(".f-data-browser-folder-btn").exists()).toBe(true);
    expect(media[1]!.text()).toBe("key:media:4096");
    expect(media[2]!.text()).toBe("type:modified");
  });

  it("serves every cell but the label's to the folderCell slot", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountFolders(
      { service },
      {
        folderCell: `<template #folderCell="s"><output>{{ s.column.key }}</output></template>`,
      },
    );
    expect(
      wrapper
        .findAll("tr")[0]!
        .findAll("output")
        .map((o) => o.text()),
    ).toEqual(["size", "modified"]);
  });

  it("selects a folder through its checkbox when the rows are selectable", async () => {
    const { service } = makeBrowser(
      { bulkActions: fakeBrowserBulkActions },
      { bulkActions: { purge: vi.fn() } },
    );
    await service.init();
    const wrapper = mountFolders({ service });
    const boxes = wrapper.findAll('td.f-data-browser-select [role="checkbox"]');
    expect(boxes).toHaveLength(3);
    await boxes[1]!.trigger("click");
    expect(service.selectedFolders).toEqual(new Set(["drafts"]));
    expect(service.path).toEqual([]);
    const rows = wrapper.findAll("tr");
    expect(rows[1]!.classes()).toContain("f-data-browser-selected");
    expect(rows[0]!.classes()).not.toContain("f-data-browser-selected");
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
