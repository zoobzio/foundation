import type { TableProps } from "../../src/types/components/table";
import type { FakeRow } from "#test/data/table";

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
    service.query.add({ kind: "text", value: "x" });
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

  it("submits typed search text as the service query", async () => {
    const { service, fetch } = makeTable();
    const wrapper = mountTable({ service });
    const input = wrapper.get(".f-data-table-search input");
    await input.setValue("alice");
    await input.trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(service.query.text).toBe("alice");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect((input.element as HTMLInputElement).value).toBe("");
  });

  it("shows the committed entries as chips and unwinds one by click", async () => {
    const { service } = makeTable();
    service.query.add({ kind: "text", value: "alice" });
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
