import type { TableProps } from "../../src/types/components/table";
import type { FakeRow } from "#test/data/table";
import type { ColumnType, TableColumnDef } from "@zoobzio/table";
import type { FunctionalComponent } from "vue";

import { afterEach, describe, expect, it, vi } from "vitest";
import { h, reactive } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import Table from "../../src/components/table.vue";
import { makeTable } from "#test/mount/table";
import { fakeActions, fakeBulkActions, fakeColumns } from "#test/data/table";
import { RouterLink } from "#test/mount/link";

const mounted: { unmount: () => void }[] = [];

/** A header's own text: its label, without the controls beside it. */
const LABEL = ".f-data-table-header-btn, .f-data-table-header";

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

const menuItem = (label: string) =>
  Array.from(
    document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  ).find((el) => el.textContent?.includes(label));

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
    expect(wrapper.findAll(LABEL).map((label) => label.text())).toEqual([
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
    const name = wrapper
      .findAll("thead th")
      .find((th) => th.find(LABEL).text() === "Name");
    if (!name) throw new Error("no Name header");
    await name.get("button").trigger("click");
    expect(fetch).toHaveBeenLastCalledWith(
      expect.objectContaining({ sorting: [{ id: "name", desc: false }] }),
      service,
    );
    expect(name.classes()).toContain("f-data-table-sorted");
    expect(name.attributes("aria-sort")).toBe("ascending");
    await name.get("button").trigger("click");
    expect(name.attributes("aria-sort")).toBe("descending");
    await name.get("button").trigger("click");
    expect(name.attributes("aria-sort")).toBeUndefined();
    expect(name.classes()).not.toContain("f-data-table-sorted");
  });

  it("adds a sort to the list on a shift click, and offers none on a column that cannot sort", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({ service });
    const header = (label: string) => {
      const th = wrapper
        .findAll("thead th")
        .find((h) => h.find(LABEL).text() === label);
      if (!th) throw new Error(`no ${label} header`);
      return th;
    };
    await header("Name").get("button").trigger("click");
    await header("Amount").get("button").trigger("click", { shiftKey: true });
    expect(service.table.atoms.sorting.get()).toEqual([
      { id: "name", desc: false },
      { id: "amount", desc: true },
    ]);
    expect(header("Status").find(".f-data-table-header-btn").exists()).toBe(
      false,
    );
  });

  it("renders the table element within a horizontal scroller", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({ service });
    const scroller = wrapper.get(".f-data-table > .f-data-table-scroller");
    expect(scroller.classes()).toContain("f-scroll-area-root");
    expect(scroller.find(".f-scroll-area-viewport .f-table").exists()).toBe(
      true,
    );
    // The toolbar and the pagination stay outside what scrolls.
    expect(scroller.find(".f-data-table-toolbar").exists()).toBe(false);
    expect(wrapper.findAll(".f-data-table > *").at(-1)?.element).not.toBe(
      scroller.element,
    );
  });

  it("holds the table element at the total size of its columns", async () => {
    const { service } = makeTable({
      columns: [
        { accessorKey: "id", meta: { label: "ID" } },
        { accessorKey: "name", size: 200, meta: { label: "Name" } },
      ],
    });
    await service.init();
    const wrapper = mountTable({ service });
    const table = wrapper.get(".f-table");
    expect(table.attributes("style")).toContain("min-width: calc(350px +");
    service.table.setColumnSizing({ name: 900 });
    await flushPromises();
    expect(table.attributes("style")).toContain("min-width: calc(1050px +");
  });

  it("swaps the scroller through its passthrough", async () => {
    const { service } = makeTable();
    await service.init();
    const Plain: FunctionalComponent = (_, { slots }) =>
      h("section", slots.default?.());
    const wrapper = mountTable({ service, pt: { scroller: { as: Plain } } });
    expect(
      wrapper.find("section.f-data-table-scroller > .f-table").exists(),
    ).toBe(true);
  });

  it("renders a resizer on every column border and widths by value", async () => {
    const { service } = makeTable(
      { actions: fakeActions, bulkActions: fakeBulkActions },
      { actions: { edit: vi.fn() }, bulkActions: { removeSelected: vi.fn() } },
    );
    await service.init();
    const wrapper = mountTable({ service });
    const resizers = wrapper.findAll("thead th > .f-data-table-resizer");
    expect(resizers).toHaveLength(6);
    expect(resizers.map((r) => r.attributes("aria-label"))).toEqual([
      "Resize ID",
      "Resize Name",
      "Resize Status",
      "Resize Created",
      "Resize Amount",
      "Resize Site",
    ]);
    expect(resizers[1]?.attributes("role")).toBe("separator");
    expect(resizers[1]?.attributes("aria-valuenow")).toBe("150");

    // One col per rendered column, select and actions included. Every
    // data column holds its size but the last, which takes what is left.
    const cols = wrapper.findAll("colgroup col");
    expect(cols).toHaveLength(8);
    expect(cols.map((c) => c.attributes("style"))).toEqual([
      undefined,
      "width: 150px;",
      "width: 150px;",
      "width: 150px;",
      "width: 150px;",
      "width: 150px;",
      undefined,
      undefined,
    ]);

    service.table.setColumnSizing({ name: 240 });
    await flushPromises();
    expect(cols[2]?.attributes("style")).toContain("width: 240px");
    expect(resizers[1]?.attributes("aria-valuenow")).toBe("240");
  });

  it("resizes a column as its resizer is dragged and resets on a double click", async () => {
    const { service } = makeTable({
      columns: [
        { accessorKey: "id", meta: { label: "ID" } },
        {
          accessorKey: "name",
          size: 200,
          minSize: 120,
          meta: { label: "Name" },
        },
        { accessorKey: "amount", meta: { label: "Amount" } },
      ],
    });
    await service.init();
    const wrapper = mountTable({ service });
    const resizer = wrapper.findAll(".f-data-table-resizer")[1];
    if (!resizer) throw new Error("no resizer");
    expect(resizer.attributes("aria-valuemin")).toBe("120");
    const th = wrapper.findAll("thead th")[1];
    const size = () => service.table.getColumn("name")?.getSize();
    await resizer.trigger("pointerdown", { button: 0, clientX: 100 });
    expect(th?.classes()).toContain("f-data-table-resizing");
    await resizer.trigger("pointermove", { clientX: 160 });
    expect(size()).toBe(260);
    expect(wrapper.findAll("colgroup col")[1]?.attributes("style")).toContain(
      "width: 260px",
    );
    await resizer.trigger("pointerup");
    expect(th?.classes()).not.toContain("f-data-table-resizing");
    await resizer.trigger("keydown", { key: "ArrowLeft" });
    expect(size()).toBe(244);
    // A drag past the column's minimum holds it there.
    await resizer.trigger("pointerdown", { button: 0, clientX: 300 });
    await resizer.trigger("pointermove", { clientX: 0 });
    await resizer.trigger("pointerup");
    expect(size()).toBe(120);
    await resizer.trigger("dblclick");
    expect(size()).toBe(200);
  });

  it("names a resizer through pt.head.resizer", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({
      service,
      pt: {
        head: {
          resizer: (column) => ({ "aria-label": `Size ${column.id}` }),
        },
      },
    });
    const resizer = wrapper.get(".f-data-table-resizer");
    expect(resizer.attributes("aria-label")).toBe("Size id");
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
    service.table.toggleAllPageRowsSelected(true);
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
    await wrapper.get("thead .f-data-table-select button").trigger("click");
    await flushPromises();
    expect(service.table.getSelectedRowIds()).toEqual(["1", "2", "3"]);
    expect(wrapper.findAll("tbody tr.f-data-table-selected")).toHaveLength(3);
    await wrapper.get("tbody .f-data-table-select button").trigger("click");
    await flushPromises();
    expect(service.table.getSelectedRowIds()).toEqual(["2", "3"]);
    const bar = wrapper.get(".f-data-table-bulk-actions");
    expect(bar.text()).toContain("2 selected");
    await bar.get(".f-data-table-bulk-action").trigger("click");
    expect(removeSelected).toHaveBeenCalledWith(["2", "3"]);
    await bar.get(".f-data-table-bulk-action-clear").trigger("click");
    expect(service.table.getSelectedRowIds()).toEqual([]);
  });

  it("renders no checkbox column without row selection", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({ service });
    expect(wrapper.find(".f-data-table-select").exists()).toBe(false);
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
      { id: "test-table", rowCount: 40 },
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
    expect(fetch).toHaveBeenLastCalledWith(
      expect.objectContaining({ pagination: { pageIndex: 1, pageSize: 10 } }),
      service,
    );
  });

  it("hides a column from the column manager", async () => {
    const [id, ...rest] = fakeColumns;
    const { service } = makeTable({
      columns: [{ ...id!, enableHiding: false }, ...rest],
    });
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
    const locked = items.find((el) => el.textContent?.includes("ID"));
    const status = items.find((el) => el.textContent?.includes("Status"));
    if (!locked || !status) throw new Error("no rendered column items");
    expect(locked.hasAttribute("data-disabled")).toBe(true);
    status.click();
    await flushPromises();
    const shown = service.table.getVisibleLeafColumns().map((c) => c.id);
    expect(shown).not.toContain("status");
    expect(shown).toContain("id");
    expect(wrapper.findAll("thead th").map((th) => th.text())).not.toContain(
      "Status",
    );
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

  it("shows the committed clauses as chips and unwinds one by click", async () => {
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

  it("hides the search without the search permission", () => {
    const { service } = makeTable({ permissions: { search: false } });
    const wrapper = mountTable({ service });
    expect(wrapper.find(".f-data-table-search").exists()).toBe(false);
  });

  it("renders every control with every permission", async () => {
    const { service } = makeTable(
      { actions: fakeActions, bulkActions: fakeBulkActions },
      { actions: { edit: vi.fn() }, bulkActions: { removeSelected: vi.fn() } },
    );
    await service.init();
    const wrapper = mountTable({ service });
    const labels = wrapper
      .findAll("button")
      .map((b) => b.attributes("aria-label"));
    expect(labels).toContain("Refresh");
    expect(labels).toContain("Columns");
    expect(wrapper.find(".f-data-table-search").exists()).toBe(true);
    expect(wrapper.find(".f-data-table-header-btn").exists()).toBe(true);
    expect(wrapper.find(".f-data-table-drag-handle").exists()).toBe(true);
    expect(wrapper.find(".f-data-table-resizer").exists()).toBe(true);
    expect(wrapper.find(".f-data-table-pin").exists()).toBe(true);
    expect(wrapper.find("th.f-data-table-select").exists()).toBe(true);
    expect(wrapper.find("th.f-data-table-actions").exists()).toBe(true);
    expect(wrapper.find("thead th:nth-child(2)").attributes("draggable")).toBe(
      "false",
    );
  });

  it("refreshes from a menu where the table has a sync", async () => {
    const refresh = vi.fn(async () => false);
    const { service, fetch } = makeTable({}, { refresh });
    await service.init();
    const wrapper = mountTable({ service });
    const root = wrapper.get(".f-data-table");
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
    expect(root.classes()).not.toContain("f-data-table-live");
    expect(menuItem("Every 10 seconds")).toBeDefined();
    expect(menuItem("Every 5 minutes")).toBeDefined();

    const thirty = menuItem("Every 30 seconds");
    thirty?.click();
    await flushPromises();
    expect(service.sync?.interval).toBe(30_000);
    expect(root.classes()).toContain("f-data-table-live");
    expect((await pick("Every 30 seconds")).hasAttribute("data-current")).toBe(
      true,
    );
    expect(menuItem("Off")?.hasAttribute("data-current")).toBe(false);

    menuItem("Refresh now")?.click();
    await flushPromises();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("keeps the table alive on the interval while it is mounted", async () => {
    vi.useFakeTimers();
    try {
      const refresh = vi.fn(async () => false);
      const { service } = makeTable(
        { sync: { interval: 10_000 } },
        { refresh },
      );
      service.sync?.setInterval(10_000);
      await service.init();
      const wrapper = mountTable({ service });
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
    const { service } = makeTable({}, { refresh: vi.fn() });
    await service.init();
    const wrapper = mountTable(
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

  it("renders no control of a permission taken away, and follows a change", async () => {
    const permissions = reactive({
      search: false,
      sort: false,
      select: false,
      actions: false,
      hide: false,
      reorder: false,
      resize: false,
      pin: false,
      pageSize: false,
      refresh: false,
    });
    const { service } = makeTable(
      { actions: fakeActions, bulkActions: fakeBulkActions, permissions },
      { actions: { edit: vi.fn() }, bulkActions: { removeSelected: vi.fn() } },
    );
    await service.init();
    const wrapper = mountTable({ service });
    const labels = () =>
      wrapper.findAll("button").map((b) => b.attributes("aria-label"));
    const withSize = mountTable({ service: makeTable().service });
    expect(labels()).not.toContain("Refresh");
    expect(labels()).not.toContain("Columns");
    expect(wrapper.find(".f-data-table-search").exists()).toBe(false);
    expect(wrapper.find(".f-data-table-header-btn").exists()).toBe(false);
    expect(wrapper.find(".f-data-table-drag-handle").exists()).toBe(false);
    expect(wrapper.find(".f-data-table-resizer").exists()).toBe(false);
    expect(wrapper.find(".f-data-table-pin").exists()).toBe(false);
    expect(wrapper.find(".f-data-table-select").exists()).toBe(false);
    expect(wrapper.find(".f-data-table-actions").exists()).toBe(false);
    expect(wrapper.find("thead th").attributes("draggable")).toBeUndefined();
    expect(wrapper.findAll("[role=combobox]").length).toBeLessThan(
      withSize.findAll("[role=combobox]").length,
    );

    permissions.sort = true;
    permissions.resize = true;
    permissions.refresh = true;
    await flushPromises();
    expect(labels()).toContain("Refresh");
    expect(wrapper.find(".f-data-table-header-btn").exists()).toBe(true);
    expect(wrapper.find(".f-data-table-resizer").exists()).toBe(true);
  });

  it("lays pinned columns out at the sides, and sticks their cells past the ones before", async () => {
    const { service } = makeTable({
      initialState: {
        columnPinning: { start: ["amount", "name"], end: ["id"] },
      },
    });
    await service.init();
    const wrapper = mountTable({ service });
    const order = ["Amount", "Name", "Status", "Created", "Site", "ID"];
    expect(wrapper.findAll(LABEL).map((label) => label.text())).toEqual(order);
    // The widths stand in the same order: the last unpinned column is the
    // one that holds none.
    const widths = wrapper
      .findAll("colgroup col")
      .map((col) => col.attributes("style"));
    expect(widths.map((w) => w === undefined)).toEqual([
      false,
      false,
      false,
      false,
      true,
      false,
    ]);

    const heads = wrapper.findAll("thead th");
    const cells = wrapper.findAll("tbody tr:first-child td");
    for (const row of [heads, cells]) {
      expect(row[0]?.classes()).toContain("f-data-table-pinned-start");
      expect(row[0]?.classes()).not.toContain("f-data-table-pinned-edge");
      expect(row[0]?.attributes("style")).toContain("+ 0px)");
      expect(row[1]?.classes()).toContain("f-data-table-pinned-edge");
      expect(row[1]?.attributes("style")).toContain(
        "inset-inline-start: calc(var(--f-data-table-start-inset, 0px) + 150px)",
      );
      expect(row[2]?.classes()).not.toContain("f-data-table-pinned");
      expect(row[2]?.attributes("style")).toBeUndefined();
      expect(row[5]?.classes()).toContain("f-data-table-pinned-end");
      expect(row[5]?.classes()).toContain("f-data-table-pinned-edge");
      expect(row[5]?.attributes("style")).toContain(
        "inset-inline-end: calc(var(--f-data-table-end-inset, 0px) + 0px)",
      );
    }
  });

  it("pins a column from its header's menu, and unpins it", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({ service });
    const trigger = () => {
      const th = wrapper
        .findAll("thead th")
        .find((h) => h.find(LABEL).text() === "Status");
      if (!th) throw new Error("no Status header");
      return th.get(".f-data-table-pin");
    };
    const choose = async (label: string) => {
      await trigger().trigger("click");
      await flushPromises();
      const item = [...document.querySelectorAll(".f-dropdown-menu-item")].find(
        (el) => el.textContent?.trim() === label,
      );
      if (!(item instanceof HTMLElement)) throw new Error(`no ${label} item`);
      item.click();
      await flushPromises();
    };
    expect(trigger().attributes("aria-label")).toBe("Pin Status");

    await choose("Pin right");
    expect(service.table.atoms.columnPinning.get()).toEqual({
      start: [],
      end: ["status"],
    });
    expect(wrapper.findAll(LABEL).at(-1)?.text()).toBe("Status");

    await choose("Pin left");
    expect(wrapper.findAll(LABEL).at(0)?.text()).toBe("Status");

    await trigger().trigger("click");
    await flushPromises();
    const offered = [...document.querySelectorAll(".f-dropdown-menu-item")].map(
      (el) => el.textContent?.trim(),
    );
    expect(offered).toEqual(["Pin right", "Unpin"]);
    await trigger().trigger("click");
    await choose("Unpin");
    expect(service.table.atoms.columnPinning.get()).toEqual({
      start: [],
      end: [],
    });
  });

  it("keeps the actions column pinned to the end, and the checkbox column beside start pins", async () => {
    const { service } = makeTable(
      { actions: fakeActions, bulkActions: fakeBulkActions },
      { actions: { edit: vi.fn() }, bulkActions: { removeSelected: vi.fn() } },
    );
    await service.init();
    const wrapper = mountTable({ service });
    expect(wrapper.classes()).toContain("f-data-table-selectable");
    expect(wrapper.classes()).toContain("f-data-table-actionable");
    for (const cell of ["th", "td"]) {
      const actions = wrapper.get(`${cell}.f-data-table-actions`);
      expect(actions.classes()).toContain("f-data-table-pinned-end");
      expect(actions.classes()).toContain("f-data-table-pinned-edge");
      expect(
        wrapper.get(`${cell}.f-data-table-select`).classes(),
      ).not.toContain("f-data-table-pinned");
    }

    service.table.getColumn("name")?.pin("start");
    service.table.getColumn("amount")?.pin("end");
    await flushPromises();
    for (const cell of ["th", "td"]) {
      // The pinned column borders the unpinned ones now.
      expect(
        wrapper.get(`${cell}.f-data-table-actions`).classes(),
      ).not.toContain("f-data-table-pinned-edge");
      expect(wrapper.get(`${cell}.f-data-table-select`).classes()).toContain(
        "f-data-table-pinned-start",
      );
    }
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
    key: keyof FakeRow & string,
    type: ColumnType,
  ): TableColumnDef<FakeRow>[] => [
    { accessorKey: "id", meta: { label: "ID", type: "number" } },
    { accessorKey: key, meta: { label: key, type, link: route } },
    { accessorKey: "site", meta: { label: "Site", type: "url" } },
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
