// The files table's own logic: sortable headers, the typed-cell cascade
// (including the filesize formatter), selection wiring, and the empty row.
// The contract mock is the unit seam; Checkbox renders real because the
// selection wiring drives through it.
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import Core from "../../../../../app/components/data/browser/files.vue";
import type {
  BrowserFilesProps,
} from "../../../../../app/types/data/browser/files";
import { createMockBrowser } from "#test/mocks/browser";
import type { FakeFile } from "#test/data/browser";

const Files: FunctionalComponent<BrowserFilesProps<FakeFile>> = Core;

const mountFiles = (
  mock = createMockBrowser(),
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(
    defineComponent({
      setup(_, { slots: forwarded }) {
        return () => h(Files, { browser: mock.service }, forwarded);
      },
    }),
    { slots },
  );
  return { ...mock, wrapper };
};

const selectableMock = () =>
  createMockBrowser({
    bulkActions: [{ icon: "delete", label: "Purge", action: vi.fn() }],
  });

describe("data browser files", () => {
  it("renders one header per column, sortable ones as buttons", () => {
    const { wrapper } = mountFiles();
    const headers = wrapper.findAll("th");
    expect(headers.map((th) => th.text())).toEqual([
      "Name",
      "Size",
      "Modified",
    ]);
    expect(headers.at(0)?.find("button").exists()).toBe(true);
    expect(headers.at(1)?.find("button").exists()).toBe(true);
    expect(headers.at(2)?.find("button").exists()).toBe(false);
  });

  it("header activation routes through browser.sortBy", async () => {
    const { service, wrapper } = mountFiles();
    const size = wrapper.findAll("th button").find((b) => b.text() === "Size");
    if (!size) throw new Error("no Size header button rendered");
    await size.trigger("click");
    expect(service.sortBy).toHaveBeenCalledWith("size");
  });

  it("marks the sorted column and shows its direction icon", () => {
    const { wrapper } = mountFiles(
      createMockBrowser({
        isSorted: (col) => String(col.key) === "size",
        getSortIcon: () => "chevron-down",
      }),
    );
    const sorted = wrapper.findAll("th").at(1);
    expect(sorted?.classes()).toContain("f-data-browser-sorted");
    expect(sorted?.get("use").attributes("href")).toBe("#chevron-down");
  });

  it("renders typed cells through the shared formatter", () => {
    const { wrapper } = mountFiles();
    const firstRow = wrapper.findAll("tbody tr").at(0);
    expect(firstRow?.findAll("td").map((td) => td.text())).toEqual([
      "logo.svg",
      "2 kB",
      "Jan 15, 2025",
    ]);
    const secondRow = wrapper.findAll("tbody tr").at(1);
    expect(secondRow?.findAll("td").at(1)?.text()).toBe("1 MB");
  });

  it("cascades cell overrides: keyed beats typed beats catch-all", () => {
    const { wrapper } = mountFiles(createMockBrowser(), {
      "cell:name": `<template #cell:name="s">
        <output>key:{{ s.value }}</output>
      </template>`,
      "cell:filesize": `<template #cell:filesize="s">
        <output>type:{{ s.value }}</output>
      </template>`,
      cell: `<template #cell="s">
        <output>all:{{ s.column.key }}</output>
      </template>`,
    });
    const firstRow = wrapper.findAll("tbody tr").at(0);
    expect(firstRow?.findAll("output").map((o) => o.text())).toEqual([
      "key:logo.svg",
      "type:2048",
      "all:modified",
    ]);
  });

  it("wires selection through the checkboxes when bulk actions exist", async () => {
    const { service, wrapper } = mountFiles(selectableMock());
    const checkboxes = wrapper.findAll('[role="checkbox"]');
    expect(checkboxes).toHaveLength(4);
    await checkboxes.at(0)?.trigger("click");
    await flushPromises();
    expect(service.toggleAll).toHaveBeenCalledOnce();
    await checkboxes.at(1)?.trigger("click");
    await flushPromises();
    expect(service.toggleRow).toHaveBeenCalledWith("1");
  });

  it("hides the selection column without bulk actions", () => {
    const { wrapper } = mountFiles();
    expect(wrapper.find('[role="checkbox"]').exists()).toBe(false);
  });

  it("renders the actions column only when file actions exist", () => {
    const bare = mountFiles();
    expect(bare.wrapper.find(".f-data-browser-actions").exists()).toBe(false);
    const acting = mountFiles(
      createMockBrowser({
        actions: [{ icon: "download", label: "Download", action: vi.fn() }],
      }),
    );
    expect(
      acting.wrapper.find("td.f-data-browser-actions").exists(),
    ).toBe(true);
    expect(
      acting.wrapper.find('use[href="#actions"]').exists(),
    ).toBe(true);
  });

  it("spans the empty row across every column", async () => {
    const { state, wrapper } = mountFiles();
    state.files.value = [];
    await flushPromises();
    const empty = wrapper.get("tbody td");
    expect(empty.attributes("colspan")).toBe("3");
    expect(empty.text()).toBe("No files");
  });

  it("serves ctx to the noFiles slot override", async () => {
    const mock = createMockBrowser();
    mock.state.files.value = [];
    const { wrapper } = mountFiles(mock, {
      noFiles: `<template #noFiles="s">
        <output>{{ s.browser.id }}</output>
      </template>`,
    });
    expect(wrapper.get("output").text()).toBe("mock-browser");
  });
});
