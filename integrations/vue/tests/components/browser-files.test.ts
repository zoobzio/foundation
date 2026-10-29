import type { BrowserFilesProps } from "../../src/types/components/browser-files";
import type { FakeFile } from "#test/data/browser";

import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import BrowserFiles from "../../src/components/browser-files.vue";
import { makeBrowser } from "#test/mount/browser";
import {
  fakeBrowserBulkActions,
  fakeFileActions,
  fakeFolderActions,
  fakeFolders,
} from "#test/data/browser";
import { RouterLink } from "#test/mount/link";
import { fakeFileColumns } from "#test/data/browser";

const mounted: { unmount: () => void }[] = [];

const mountFiles = (
  props: BrowserFilesProps<FakeFile>,
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(BrowserFiles<FakeFile>, { props, slots });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
});

describe("browser-files", () => {
  it("formats typed cells through the service's locale", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountFiles({ service });
    const rows = wrapper.findAll("tr");
    expect(rows).toHaveLength(3);
    expect(rows[1]!.findAll("td").map((td) => td.text())).toEqual([
      "hero.png",
      "1 MB",
      "Feb 20, 2025",
    ]);
  });

  it("spans the empty row across every column", async () => {
    const { service } = makeBrowser(
      { actions: fakeFileActions, bulkActions: fakeBrowserBulkActions },
      { actions: { download: vi.fn(), remove: vi.fn() } },
      { folders: fakeFolders, files: [] },
    );
    await service.init();
    const wrapper = mountFiles({ service });
    const empty = wrapper.get(".f-data-browser-no-files td");
    expect(empty.attributes("colspan")).toBe("5");
    expect(empty.text()).toBe("No files");
  });

  it("toggles selection through the row checkboxes", async () => {
    const { service } = makeBrowser(
      { bulkActions: fakeBrowserBulkActions },
      { bulkActions: { purge: vi.fn() } },
    );
    await service.init();
    const wrapper = mountFiles({ service });
    const boxes = wrapper.findAll('[role="checkbox"]');
    expect(boxes).toHaveLength(3);
    await boxes[2]!.trigger("click");
    await flushPromises();
    expect(service.selected).toEqual(new Set(["3"]));
    expect(wrapper.findAll("tr")[2]!.classes()).toContain(
      "f-data-browser-selected",
    );
    await boxes[2]!.trigger("click");
    await flushPromises();
    expect(service.selected.size).toBe(0);
  });

  it("hides the selection and actions cells without bulk or file actions", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountFiles({ service });
    expect(wrapper.find('[role="checkbox"]').exists()).toBe(false);
    expect(wrapper.find(".f-data-browser-select").exists()).toBe(false);
    expect(wrapper.find(".f-data-browser-actions").exists()).toBe(false);
  });

  it("keeps the trailing cell for alignment when only folder actions exist", async () => {
    const { service } = makeBrowser(
      { folderActions: fakeFolderActions },
      { folderActions: { rename: vi.fn() } },
    );
    await service.init();
    const wrapper = mountFiles({ service });
    const trailing = wrapper.findAll("td.f-data-browser-actions");
    expect(trailing).toHaveLength(3);
    expect(trailing[0]!.find("button").exists()).toBe(false);
  });

  it("replaces the actions trigger from the row-scoped actions slot", async () => {
    const { service } = makeBrowser(
      { actions: fakeFileActions },
      { actions: { download: vi.fn(), remove: vi.fn() } },
    );
    await service.init();
    const wrapper = mountFiles(
      { service },
      {
        actions: `<template #actions="s"><i class="mine">{{ s.row.name }}</i></template>`,
      },
    );
    expect(wrapper.findAll('button[aria-label="Actions"]')).toHaveLength(0);
    expect(
      wrapper.findAll("td.f-data-browser-actions i.mine").map((i) => i.text()),
    ).toEqual(["logo.svg", "hero.png", "notes.md"]);
  });

  it("serves the typed cell context to a cell slot", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountFiles(
      { service },
      {
        "cell:size": `<template #cell:size="s"><output>{{ s.column.type }}={{ s.value }}</output></template>`,
      },
    );
    expect(wrapper.findAll("output").map((o) => o.text())).toEqual([
      "filesize=2048",
      "filesize=1048576",
      "filesize=512",
    ]);
  });
});

describe("browser-files link part", () => {
  it("renders url cells as anchors and pt.link swaps them for a component", async () => {
    const { service } = makeBrowser({
      columns: [
        ...fakeFileColumns,
        { key: "name", label: "Open", type: "url" },
      ],
    });
    await service.init();
    const wrapper = mountFiles({
      service,
      pt: { link: ({ value }) => ({ as: RouterLink, title: String(value) }) },
    });
    const anchor = wrapper.get("a[data-router]");
    expect(anchor.attributes("href")).toBe("logo.svg");
    expect(anchor.attributes("title")).toBe("logo.svg");
    expect(anchor.attributes("target")).toBe("_blank");
    expect(anchor.classes()).toContain("f-anchor");
  });
});
