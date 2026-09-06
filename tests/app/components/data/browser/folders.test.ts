// The folder rows' own logic: the open dispatch, icon fallback, the count
// badge, column alignment against the file rows, and the folder actions
// affordance. The contract mock is the unit seam — alphabetical ordering
// is the service's contract, tested in tests/app/services/browser.test.ts.
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent } from "vue";
import { mount } from "@vue/test-utils";
import Core from "../../../../../app/components/data/browser/folders.vue";
import type {
  BrowserFoldersProps,
} from "../../../../../app/types/data/browser/folders";
import { createMockBrowser } from "#test/mocks/browser";
import { fakeFolders } from "#test/data/browser";
import type { FakeFile } from "#test/data/browser";

const Folders: FunctionalComponent<BrowserFoldersProps<FakeFile>> = Core;

const mountFolders = (
  mock = createMockBrowser(),
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(
    defineComponent({
      setup(_, { slots: forwarded }) {
        return () =>
          h("table", h(Folders, { browser: mock.service }, forwarded));
      },
    }),
    { slots },
  );
  return { ...mock, wrapper };
};

describe("data browser folders", () => {
  it("renders one table row per folder in service order", () => {
    const { wrapper } = mountFolders();
    expect(wrapper.get("tbody").classes()).toContain(
      "f-data-browser-folders",
    );
    const rows = wrapper.findAll("tr");
    expect(rows).toHaveLength(3);
    expect(rows.map((tr) => tr.get(".f-span").text())).toEqual([
      "Media",
      "Archive",
      "Drafts",
    ]);
  });

  it("spans the label cell across the data columns", () => {
    const { wrapper } = mountFolders();
    const label = wrapper.findAll("tr td").at(0);
    expect(label?.attributes("colspan")).toBe("3");
  });

  it("keeps an empty selection cell for alignment when files are selectable", () => {
    const plain = mountFolders();
    expect(plain.wrapper.find(".f-data-browser-select").exists()).toBe(false);
    const selectable = mountFolders(
      createMockBrowser({
        bulkActions: [{ icon: "delete", label: "Purge", action: vi.fn() }],
      }),
    );
    const select = selectable.wrapper.find("td.f-data-browser-select");
    expect(select.exists()).toBe(true);
    expect(select.find('[role="checkbox"]').exists()).toBe(false);
  });

  it("folder activation routes through browser.open", async () => {
    const { service, wrapper } = mountFolders();
    const media = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Media"));
    if (!media) throw new Error("no Media folder rendered");
    await media.trigger("click");
    expect(service.open).toHaveBeenCalledWith(fakeFolders.at(0));
  });

  it("falls back to the folder icon unless the folder brings its own", () => {
    const { wrapper } = mountFolders();
    const rows = wrapper.findAll("tr");
    expect(rows.at(0)?.get("use").attributes("href")).toBe("#folder");
    expect(rows.at(1)?.get("use").attributes("href")).toBe("#layers");
  });

  it("shows the count badge only when the folder carries one", () => {
    const { wrapper } = mountFolders();
    const rows = wrapper.findAll("tr");
    expect(rows.at(0)?.find(".f-data-browser-folder-count").text()).toBe(
      "12",
    );
    expect(
      rows.at(1)?.find(".f-data-browser-folder-count").exists(),
    ).toBe(false);
  });

  it("renders the folder actions cell only when actions exist", () => {
    const bare = mountFolders();
    expect(bare.wrapper.find(".f-data-browser-actions").exists()).toBe(false);
    const acting = mountFolders(
      createMockBrowser({
        folderActions: [{ icon: "edit", label: "Rename", action: vi.fn() }],
      }),
    );
    expect(
      acting.wrapper.findAll('use[href="#actions"]'),
    ).toHaveLength(fakeFolders.length);
  });

  it("serves ctx and the folder to slot overrides", () => {
    const { wrapper } = mountFolders(createMockBrowser(), {
      folder: `<template #folder="s">
        <output>{{ s.folder.key }}:{{ s.browser.id }}</output>
      </template>`,
    });
    expect(wrapper.findAll("output").map((o) => o.text())).toEqual([
      "media:mock-browser",
      "archive:mock-browser",
      "drafts:mock-browser",
    ]);
    expect(wrapper.findAll("button")).toHaveLength(0);
  });
});
