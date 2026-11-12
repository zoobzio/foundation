import type { TableProps } from "../../src/types/components/table";
import type { FakeRow } from "#test/data/table";
import type { DataTableColumn } from "@zoobzio/table";

import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Table from "../../src/components/table.vue";
import { makeTable } from "#test/mount/table";
import { fakeActions, fakeBulkActions } from "#test/data/table";
import { RouterLink } from "#test/mount/link";

const mounted: { unmount: () => void }[] = [];

const mountTable = (
  props: TableProps<FakeRow>,
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(Table<FakeRow>, {
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

describe("table", () => {
  it("renders the empty state before init and rows after", async () => {
    const { service } = makeTable();
    const wrapper = mountTable({ service });
    expect(wrapper.get(".f-data-table-empty").text()).toBe("No data");
    await service.init();
    await flushPromises();
    expect(wrapper.findAll("tbody tr")).toHaveLength(3);
    expect(wrapper.find(".f-data-table-empty").exists()).toBe(false);
  });

  it("renders headers in column order and formats cells by type", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({ service });
    expect(wrapper.findAll("thead th").map((th) => th.text())).toEqual([
      "ID",
      "Name",
      "Status",
      "Created",
      "Amount",
      "Site",
    ]);
    const first = wrapper.findAll("tbody tr").at(0);
    if (!first) throw new Error("no rows");
    const cells = first.findAll("td").map((td) => td.text());
    expect(cells.at(4)).toBe("$100.00");
    const anchor = first.get("td:last-child a");
    expect(anchor.attributes("href")).toBe("https://a.example");
  });

  it("sorts through the service on a header click", async () => {
    const { service, fetch } = makeTable();
    await service.init();
    const wrapper = mountTable({ service });
    const name = wrapper.findAll("thead th").find((th) => th.text() === "Name");
    if (!name) throw new Error("no Name header");
    await name.get("button").trigger("click");
    expect(service.sortField).toBe("name");
    expect(fetch).toHaveBeenLastCalledWith(
      expect.objectContaining({ sortField: "name", sortDirection: "asc" }),
      service,
    );
    expect(name.classes()).toContain("f-data-table-sorted");
  });

  it("renders a resizer on every column border and widths by value", async () => {
    const { service } = makeTable(
      { actions: fakeActions, bulkActions: fakeBulkActions },
      { actions: { edit: vi.fn() }, bulkActions: { removeSelected: vi.fn() } },
    );
    await service.init();
    const wrapper = mountTable({ service });
    const resizers = wrapper.findAll("thead th > .f-data-table-resizer");
    expect(resizers).toHaveLength(service.visibleColumns.length);
    expect(resizers.map((r) => r.attributes("aria-label"))).toEqual([
      "Resize ID",
      "Resize Name",
      "Resize Status",
      "Resize Created",
      "Resize Amount",
      "Resize Site",
    ]);
    expect(resizers[1]?.attributes("role")).toBe("separator");
    expect(resizers[1]?.attributes("aria-valuenow")).toBeUndefined();

    // One col per rendered column, select and actions included.
    const cols = wrapper.findAll("colgroup col");
    expect(cols).toHaveLength(service.colSpan);
    expect(cols.every((c) => !c.attributes("style"))).toBe(true);

    service.resizeColumn("name", 240);
    await flushPromises();
    expect(cols[2]?.attributes("style")).toContain("width: 240px");
    expect(resizers[1]?.attributes("aria-valuenow")).toBe("240");
    expect(resizers[1]?.attributes("aria-valuemin")).toBe("48");
  });

  it("resizes a column as its resizer is dragged and resets on a double click", async () => {
    const { service } = makeTable({
      columns: [
        { key: "id", label: "ID", type: "number" },
        { key: "name", label: "Name", type: "text", width: 200 },
      ],
    });
    await service.init();
    const wrapper = mountTable({ service });
    const resizer = wrapper.findAll(".f-data-table-resizer")[1];
    if (!resizer) throw new Error("no resizer");
    const th = wrapper.findAll("thead th")[1];
    await resizer.trigger("pointerdown", { button: 0, clientX: 100 });
    expect(th?.classes()).toContain("f-data-table-resizing");
    await resizer.trigger("pointermove", { clientX: 160 });
    expect(service.columnWidth("name")).toBe(260);
    expect(wrapper.findAll("colgroup col")[1]?.attributes("style")).toContain(
      "width: 260px",
    );
    await resizer.trigger("pointerup");
    expect(th?.classes()).not.toContain("f-data-table-resizing");
    await resizer.trigger("keydown", { key: "ArrowLeft" });
    expect(service.columnWidth("name")).toBe(244);
    await resizer.trigger("dblclick");
    expect(service.columnWidth("name")).toBe(200);
  });

  it("names a resizer through pt.head.resizer", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({
      service,
      pt: {
        head: {
          resizer: (column) => ({ "aria-label": `Size ${column.label}` }),
        },
      },
    });
    const resizer = wrapper.get(".f-data-table-resizer");
    expect(resizer.attributes("aria-label")).toBe("Size ID");
    expect(resizer.attributes("role")).toBe("separator");
  });

  it("relays the bulkClear slot from the top", async () => {
    const { service } = makeTable(
      { bulkActions: fakeBulkActions },
      { bulkActions: { removeSelected: vi.fn() } },
    );
    await service.init();
    const wrapper = mountTable(
      { service },
      { bulkClear: `<template #bulkClear><u>clear</u></template>` },
    );
    service.toggleAll();
    await flushPromises();
    expect(wrapper.get(".f-data-table-bulk-action-clear u").text()).toBe(
      "clear",
    );
  });

  it("selects rows and shows the bulk actions bar", async () => {
    const removeSelected = vi.fn();
    const { service } = makeTable(
      { bulkActions: fakeBulkActions },
      { bulkActions: { removeSelected } },
    );
    await service.init();
    const wrapper = mountTable({ service });
    expect(wrapper.find(".f-data-table-bulk-actions").exists()).toBe(false);
    service.toggleAll();
    await flushPromises();
    expect(service.selected.size).toBe(3);
    const bar = wrapper.get(".f-data-table-bulk-actions");
    expect(bar.text()).toContain("3 selected");
    await bar.get(".f-data-table-bulk-action").trigger("click");
    expect(removeSelected).toHaveBeenCalledWith(service.selected);
    await bar.get(".f-data-table-bulk-action-clear").trigger("click");
    expect(service.selected.size).toBe(0);
  });

  it("renders the actions column and dispatches a row action by key", async () => {
    const edit = vi.fn();
    const { service } = makeTable(
      { actions: fakeActions },
      { actions: { edit, remove: vi.fn() } },
    );
    await service.init();
    const wrapper = mountTable({ service });
    const cells = wrapper.findAll("tbody tr td.f-data-table-actions");
    expect(cells).toHaveLength(3);
    await cells[0]!.get("button.f-button").trigger("click", {
      button: 0,
      ctrlKey: false,
    });
    await flushPromises();
    const item = Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    ).find((el) => el.textContent?.includes("Edit"));
    if (!item) throw new Error("no rendered Edit item");
    item.click();
    await flushPromises();
    expect(edit).toHaveBeenCalledWith(service.data[0]);
  });

  it("cascades cell slots: key beats type beats catch-all", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable(
      { service },
      {
        "cell:name": "<em>by-key</em>",
        "cell:currency": "<em>by-type</em>",
        cell: "<em>all</em>",
      },
    );
    const first = wrapper.findAll("tbody tr").at(0);
    if (!first) throw new Error("no rows");
    const cells = first.findAll("td").map((td) => td.text());
    expect(cells).toEqual(["all", "by-key", "all", "all", "by-type", "all"]);
  });

  it("relays the service's domain events as emits", async () => {
    const { service } = makeTable();
    const wrapper = mountTable({ service });
    await service.init();
    service.query.add({ kind: "literal", key: "text", value: "x" });
    await flushPromises();
    expect(wrapper.emitted("updated")?.at(0)).toEqual([
      { id: "test-table", total: 3 },
    ]);
    expect(wrapper.emitted("filtered")?.at(0)).toEqual([
      { id: "test-table", query: "x", filters: [] },
    ]);
  });

  it("drives paging through the pagination part", async () => {
    const { service, fetch } = makeTable();
    await service.init();
    const wrapper = mountTable({ service });
    const next = wrapper
      .findAll("button")
      .find((b) => b.attributes("aria-label") === "Next" || b.text() === "2");
    if (!next) throw new Error("no page control");
    await next.trigger("click");
    expect(service.page).toBe(2);
    expect(fetch).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2 }),
      service,
    );
  });

  it("hides a column from the column manager", async () => {
    const { service } = makeTable({ pinnedColumns: ["id"] });
    await service.init();
    const wrapper = mountTable({ service });
    const trigger = wrapper
      .findAll("button")
      .find((b) => b.attributes("aria-label") === "Columns");
    if (!trigger) throw new Error("no columns trigger");
    await trigger.trigger("click", { button: 0, ctrlKey: false });
    await flushPromises();
    const items = Array.from(
      document.body.querySelectorAll<HTMLElement>(".f-listbox-item"),
    );
    const id = items.find((el) => el.textContent?.includes("ID"));
    const status = items.find((el) => el.textContent?.includes("Status"));
    if (!id || !status) throw new Error("no rendered column items");
    expect(id.hasAttribute("data-disabled")).toBe(true);
    status.click();
    await flushPromises();
    expect(service.columnOrder).not.toContain("status");
    expect(service.columnOrder).toContain("id");
  });

  it("submits quoted search text as the service query", async () => {
    const { service, fetch } = makeTable();
    const wrapper = mountTable({ service });
    const input = wrapper.get(".f-data-table-search input");
    await input.setValue('"alice');
    await input.trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(service.query.text).toBe("alice");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect((input.element as HTMLInputElement).value).toBe("");
  });

  it("shows the committed entries as chips and unwinds one by click", async () => {
    const { service } = makeTable();
    service.query.add({ kind: "literal", key: "text", value: "alice" });
    service.query.add({ kind: "filter", key: "status", value: "Active" });
    const wrapper = mountTable({ service });
    await flushPromises();
    const chips = wrapper.findAll(".f-chip");
    expect(chips.map((c) => c.text())).toEqual(['"alice"', "Status: Active"]);
    await chips[1]!.trigger("click");
    expect(service.query.filters).toEqual([]);
    await wrapper.get(".f-chip").trigger("click");
    expect(service.query.text).toBe("");
  });

  it("search pt overrides reach the autocomplete", () => {
    const { service } = makeTable();
    const wrapper = mountTable({
      service,
      pt: { search: { placeholder: "Find" } },
    });
    expect(
      wrapper.get(".f-data-table-search input").attributes("placeholder"),
    ).toBe("Find");
  });

  it("hides the search when the config says so", () => {
    const { service } = makeTable({ searchable: false });
    const wrapper = mountTable({ service });
    expect(wrapper.find(".f-data-table-search").exists()).toBe(false);
  });

  it("pt overrides reach their part", () => {
    const { service } = makeTable();
    const wrapper = mountTable({
      service,
      pt: { refresh: { label: "Reload" } },
    });
    const refresh = wrapper
      .findAll("button")
      .find((b) => b.attributes("aria-label") === "Reload");
    expect(refresh).toBeDefined();
  });
});

describe("table column links", () => {
  const route = (row: FakeRow) => `/rows/${row.id}`;
  const linked = (
    key: keyof FakeRow,
    type: DataTableColumn<FakeRow>["type"],
  ): DataTableColumn<FakeRow>[] => [
    { key: "id", label: "ID", type: "number" },
    { key, label: String(key), type, link: route },
    { key: "site", label: "Site", type: "url" },
  ];

  it("renders a linked text cell as an anchor to the route around the text", async () => {
    const { service } = makeTable({ columns: linked("name", "text") });
    await service.init();
    const wrapper = mountTable({ service });
    const first = wrapper.findAll("tbody tr").at(0);
    if (!first) throw new Error("no rows");
    const anchor = first.get("td:nth-child(2) a");
    expect(anchor.attributes("href")).toBe("/rows/1");
    expect(anchor.attributes("target")).toBeUndefined();
    expect(anchor.attributes("rel")).toBeUndefined();
    expect(anchor.classes()).toContain("f-anchor");
    expect(anchor.text()).toBe("Alice");
  });

  it("renders a linked date cell with the formatted date inside the anchor", async () => {
    const { service } = makeTable({ columns: linked("created", "date") });
    await service.init();
    const wrapper = mountTable({ service });
    const first = wrapper.findAll("tbody tr").at(0);
    if (!first) throw new Error("no rows");
    const anchor = first.get("td:nth-child(2) a");
    expect(anchor.attributes("href")).toBe("/rows/1");
    expect(anchor.get("span").text()).toBe("Jan 15, 2025");
  });

  it("leaves a url cell as a new-tab link to its value", async () => {
    const { service } = makeTable({ columns: linked("name", "text") });
    await service.init();
    const wrapper = mountTable({ service });
    const first = wrapper.findAll("tbody tr").at(0);
    if (!first) throw new Error("no rows");
    const anchor = first.get("td:last-child a");
    expect(anchor.attributes("href")).toBe("https://a.example");
    expect(anchor.attributes("target")).toBe("_blank");
    expect(anchor.attributes("rel")).toBe("noopener");
  });

  it("wraps a cell:<type> slot in the anchor and lets a cell:<key> slot replace the cell", async () => {
    const { service } = makeTable({ columns: linked("created", "date") });
    await service.init();
    const wrapper = mountTable(
      { service },
      { "cell:date": "<em>by-type</em>", "cell:id": "<em>by-key</em>" },
    );
    const first = wrapper.findAll("tbody tr").at(0);
    if (!first) throw new Error("no rows");
    expect(first.get("td:nth-child(2) a em").text()).toBe("by-type");
    expect(first.find("td:nth-child(1) a").exists()).toBe(false);
    expect(first.get("td:nth-child(1) em").text()).toBe("by-key");
  });

  it("renders a cell:<key> slot on a linked column without the anchor", async () => {
    const { service } = makeTable({ columns: linked("name", "text") });
    await service.init();
    const wrapper = mountTable({ service }, { "cell:name": "<em>own</em>" });
    const first = wrapper.findAll("tbody tr").at(0);
    if (!first) throw new Error("no rows");
    expect(first.find("td:nth-child(2) a").exists()).toBe(false);
    expect(first.get("td:nth-child(2) em").text()).toBe("own");
  });

  it("routes a linked cell through the component pt.body.link names", async () => {
    const { service } = makeTable({ columns: linked("name", "text") });
    await service.init();
    const wrapper = mountTable({
      service,
      pt: { body: { link: () => ({ as: RouterLink }) } },
    });
    const first = wrapper.findAll("tbody tr").at(0);
    if (!first) throw new Error("no rows");
    const anchor = first.get("td:nth-child(2) a[data-router]");
    expect(anchor.attributes("href")).toBe("/rows/1");
    expect(anchor.text()).toBe("Alice");
  });
});

describe("table link part", () => {
  it("pt.body.link swaps the url cell anchor for a component", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({
      service,
      pt: { body: { link: () => ({ as: RouterLink }) } },
    });
    const first = wrapper.findAll("tbody tr").at(0);
    if (!first) throw new Error("no rows");
    const anchor = first.get("td:last-child a[data-router]");
    expect(anchor.attributes("href")).toBe("https://a.example");
    expect(anchor.attributes("target")).toBe("_blank");
    expect(anchor.attributes("rel")).toBe("noopener");
    expect(anchor.classes()).toContain("f-anchor");
  });
});
