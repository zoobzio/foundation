// The file rows' own logic: the typed-cell cascade (including the filesize
// formatter), selection wiring, the actions column, and the empty row.
// The contract mock is the unit seam; Checkbox renders real because the
// selection wiring drives through it. The section is headerless by design —
// sorting lives on the service, not in this markup.
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
        return () =>
          h("table", h(Files, { browser: mock.service }, forwarded));
      },
    }),
    { slots },
  );
  return { ...mock, wrapper };
};

describe("data browser files", () => {
  it("renders no header row — the section is rows only", () => {
    const { wrapper } = mountFiles();
    expect(wrapper.find("thead").exists()).toBe(false);
    expect(wrapper.find("th").exists()).toBe(false);
    expect(wrapper.get("tbody").classes()).toContain("f-data-browser-files");
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

  it("wires row selection through the checkboxes when bulk actions exist", async () => {
    const mock = createMockBrowser({
      bulkActions: [{ label: "Purge", action: vi.fn() }],
    });
    const { service, wrapper } = mountFiles(mock);
    const checkboxes = wrapper.findAll('[role="checkbox"]');
    expect(checkboxes).toHaveLength(3);
    await checkboxes.at(0)?.trigger("click");
    await flushPromises();
    expect(service.toggleRow).toHaveBeenCalledWith("1");
  });

  it("hides the selection column without bulk actions", () => {
    const { wrapper } = mountFiles();
    expect(wrapper.find('[role="checkbox"]').exists()).toBe(false);
    expect(wrapper.find(".f-data-browser-select").exists()).toBe(false);
  });

  it("renders the actions cell only when file actions exist", () => {
    const bare = mountFiles();
    expect(bare.wrapper.find(".f-data-browser-actions").exists()).toBe(false);
    const acting = mountFiles(
      createMockBrowser({
        actions: [{ label: "Download", action: vi.fn() }],
      }),
    );
    expect(
      acting.wrapper.find("td.f-data-browser-actions").exists(),
    ).toBe(true);
    expect(
      acting.wrapper.find('button[aria-label="Actions"]').text(),
    ).toBe("Actions");
  });

  it("keeps the trailing cell for alignment when only folder actions exist", () => {
    const { wrapper } = mountFiles(
      createMockBrowser({
        folderActions: [{ label: "Rename", action: vi.fn() }],
      }),
    );
    const trailing = wrapper.find("td.f-data-browser-actions");
    expect(trailing.exists()).toBe(true);
    expect(trailing.find("button").exists()).toBe(false);
  });

  it("relays the row-scoped action icon slots into the actions menu", async () => {
    const mock = createMockBrowser({
      actions: [{ label: "Download", action: vi.fn() }],
    });
    const wrapper = mount(
      defineComponent({
        setup(_, { slots: forwarded }) {
          return () =>
            h(
              "table",
              h(
                Files,
                { browser: mock.service, pt: { actionsMenu: { open: true } } },
                forwarded,
              ),
            );
        },
      }),
      {
        attachTo: document.body,
        slots: {
          actionsIcon: `<template #actionsIcon="s"><i>{{ s.row.name }}</i></template>`,
          actionIcon: `<template #actionIcon="s"><b>{{ s.row.name }}:{{ s.item.label }}</b></template>`,
        },
      },
    );
    await flushPromises();
    const triggers = wrapper.findAll('button[aria-label="Actions"]');
    expect(triggers.map((t) => t.text())).toEqual([
      "logo.svg",
      "hero.png",
      "notes.md",
    ]);
    // Menu content is portalled under document.body, one open menu per row.
    const items = document.querySelectorAll('[role="menuitem"] b');
    expect(Array.from(items, (b) => b.textContent)).toEqual([
      "logo.svg:Download",
      "hero.png:Download",
      "notes.md:Download",
    ]);
    wrapper.unmount();
    document.body.innerHTML = "";
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
