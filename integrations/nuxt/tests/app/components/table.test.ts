// The table wrapper: NuxtLink under the body's `link` part, row actions
// through the layer's Menu with their icons, the toolbar, head, and
// pagination icons, the search with its `magic` icon, `/` hint, and `/`
// focus key, the service events relayed.
import type { LinkedRow } from "#test/mount/table";

import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Table from "../../../app/components/table";
import type { Config } from "@zoobzio/table";

import { reactive } from "vue";
import { TableService, createTableState } from "@zoobzio/table";
import { $prosary } from "#test/mocks/app";
import { makeTable } from "#test/mount/table";

const mounted: { unmount: () => void }[] = [];

const mountTable = (props: {
  service: ReturnType<typeof makeTable>["service"];
  pt?: object;
}) => {
  const wrapper = mount(Table<LinkedRow>, {
    props,
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("table wrapper", () => {
  it("renders url cells through NuxtLink with the recipe's attributes", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({ service });
    const links = wrapper.findAll("tbody a[data-nuxt]");
    expect(links.map((a) => a.attributes("href"))).toEqual([
      "https://a.example",
      "https://b.example",
    ]);
    expect(links[0]?.attributes("target")).toBe("_blank");
  });

  it("renders a linked cell through NuxtLink to the column's route", async () => {
    const { service } = makeTable({
      columns: [
        { key: "id", label: "ID", type: "number" },
        {
          key: "name",
          label: "Name",
          type: "text",
          link: (row) => `/people/${row.id}`,
        },
      ],
    });
    await service.init();
    const wrapper = mountTable({ service });
    const links = wrapper.findAll("tbody a[data-nuxt]");
    expect(links.map((a) => a.attributes("href"))).toEqual([
      "/people/1",
      "/people/2",
    ]);
    expect(links[0]?.attributes("target")).toBeUndefined();
    expect(links[0]?.text()).toBe("Alice");
  });

  it("composes a consumer's pt.body.link over NuxtLink", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({
      service,
      pt: { body: { link: () => ({ class: "custom" }) } },
    });
    const link = wrapper.get("tbody a[data-nuxt]");
    expect(link.classes()).toContain("custom");
    expect(link.attributes("href")).toBe("https://a.example");
  });

  it("draws a row action's icon through the layer's Menu", async () => {
    const { service } = makeTable(
      {
        actions: {
          edit: { label: "Edit", icon: "next" },
          remove: { label: "Remove" },
        },
      },
      { actions: { edit: vi.fn(), remove: vi.fn() } },
    );
    await service.init();
    const wrapper = mountTable({ service });
    await wrapper
      .get('button[aria-label="Actions"]')
      .trigger("click", { button: 0, ctrlKey: false });
    await flushPromises();
    const items = Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    expect(items.map((el) => el.textContent?.trim())).toEqual([
      "Edit",
      "Remove",
    ]);
    expect(
      items[0]?.querySelector("svg[data-icon]")?.getAttribute("data-icon"),
    ).toBe("next");
    expect(items[1]?.querySelector("svg")).toBeNull();
  });

  it("draws the toolbar, row action, drag, and pagination icons", async () => {
    const { service } = makeTable(
      { actions: { edit: { label: "Edit" } } },
      { actions: { edit: vi.fn() } },
    );
    await service.init();
    const wrapper = mountTable({ service });
    const icon = (selector: string) =>
      wrapper.get(`${selector} svg[data-icon]`).attributes("data-icon");
    expect(icon('button[aria-label="Refresh"]')).toBe("refresh");
    expect(icon('button[aria-label="Columns"]')).toBe("columns");
    expect(icon('button[aria-label="Actions"]')).toBe("actions");
    expect(wrapper.get('button[aria-label="Refresh"]').text()).toBe("");
    expect(
      wrapper.findAll('.f-data-table-drag-handle svg[data-icon="drag"]'),
    ).toHaveLength(3);
    expect(icon('button[aria-label="First"]')).toBe("first");
    expect(icon('button[aria-label="Last"]')).toBe("last");
    expect(icon("button.f-select-trigger")).toBe("expand");
  });

  it("draws the sort direction after a sorted header", async () => {
    const { service } = makeTable({
      columns: [
        { key: "id", label: "ID", type: "number" },
        { key: "name", label: "Name", type: "text", sortable: true },
        { key: "site", label: "Site", type: "url" },
      ],
    });
    await service.init();
    const wrapper = mountTable({ service });
    expect(wrapper.find("th svg[data-icon^='sort']").exists()).toBe(false);
    service.sortBy("name");
    await flushPromises();
    const sorted = () =>
      wrapper
        .get("th.f-data-table-sorted svg[data-icon]")
        .attributes("data-icon");
    expect(sorted()).toBe("sort-asc");
    service.sortBy("name");
    await flushPromises();
    expect(sorted()).toBe("sort-desc");
  });

  it("draws magic at the front of the search and the / hint after its input", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({ service });
    const input = wrapper.get(".f-data-table-search input").element;
    const lead = wrapper.get(".f-data-table-search").element.firstElementChild;
    expect(lead?.getAttribute("data-icon")).toBe("magic");
    const hint = input.nextElementSibling;
    expect(hint?.tagName).toBe("KBD");
    expect(hint?.textContent).toBe("/");
    expect(hint?.getAttribute("aria-hidden")).toBe("true");
  });

  it("focuses the search on / pressed outside a field, and not within one", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({ service });
    const input = wrapper.get(".f-data-table-search input").element;
    const press = (target: EventTarget, init: KeyboardEventInit = {}) => {
      const event = new KeyboardEvent("keydown", {
        key: "/",
        code: "Slash",
        bubbles: true,
        cancelable: true,
        ...init,
      });
      target.dispatchEvent(event);
      target.dispatchEvent(
        new KeyboardEvent("keyup", { ...init, key: "/", bubbles: true }),
      );
      return event;
    };
    expect(document.activeElement).not.toBe(input);
    const claimed = press(document.body);
    expect(document.activeElement).toBe(input);
    expect(claimed.defaultPrevented).toBe(true);

    const other = document.createElement("input");
    document.body.append(other);
    other.focus();
    const typed = press(other);
    expect(document.activeElement).toBe(other);
    expect(typed.defaultPrevented).toBe(false);
  });

  it("keeps a consumer's pt.search over the layer's search", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({
      service,
      pt: { search: { placeholder: "Find" } },
    });
    const input = wrapper.get(".f-data-table-search input");
    expect(input.attributes("placeholder")).toBe("Find");
    expect(
      wrapper
        .get(".f-data-table-search")
        .element.firstElementChild?.getAttribute("data-icon"),
    ).toBe("magic");
  });

  it("relays the service's domain events", async () => {
    const { service } = makeTable();
    const wrapper = mountTable({ service });
    await service.init();
    const updated = wrapper.emitted("updated")?.at(0)?.at(0);
    expect(updated).toMatchObject({ id: "test-table", total: 2 });
  });

  it("reads its empty state from the contract", async () => {
    const { service } = makeTable(
      {},
      { fetch: vi.fn(async () => ({ data: [], total: 0, pageCount: 0 })) },
    );
    await service.init();
    const wrapper = mountTable({ service });
    expect(wrapper.get("tbody").text()).toBe("No data");
  });

  it("reads the bulk bar's clear button from the contract", async () => {
    const { service } = makeTable(
      { bulkActions: { purge: { label: "Purge" } } },
      { bulkActions: { purge: vi.fn() } },
    );
    await service.init();
    const wrapper = mountTable({ service });
    service.toggleRow("1");
    await flushPromises();
    expect(wrapper.get(".f-data-table-bulk-action-clear").text()).toBe("Clear");
  });

  it("formats typed cells through the app's prosary service", async () => {
    type Typed = {
      id: number;
      when: Date;
      day: string;
      amount: number;
      size: number;
      ok: boolean;
    };
    const at = new Date("2025-11-04T13:05:00Z");
    const rows: Typed[] = [
      {
        id: 1,
        when: at,
        day: "2025-11-04",
        amount: 1234.5,
        size: 1536,
        ok: true,
      },
    ];
    const config: Config<Typed> = {
      columns: [
        { key: "when", label: "When", type: "datetime" },
        { key: "day", label: "Day", type: "date" },
        { key: "amount", label: "Amount", type: "currency" },
        { key: "size", label: "Size", type: "filesize" },
        { key: "ok", label: "Ok", type: "boolean" },
        { key: "id", label: "ID", type: "number" },
      ],
      rowKey: "id",
    };
    const service = new TableService<Typed>(
      "typed-table",
      config,
      reactive(createTableState(config)),
      { fetch: vi.fn(async () => ({ data: rows, total: 1, pageCount: 1 })) },
    );
    await service.init();
    const wrapper = mount(Table<Typed>, {
      props: { service },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await flushPromises();
    const cells = wrapper.findAll("tbody td").map((td) => td.text());
    expect(cells).toContain(`${$prosary.date(at)} ${$prosary.time(at)}`);
    expect(cells).toContain(
      $prosary.date(new Date("2025-11-04"), {
        dateStyle: "medium",
        timeZone: "UTC",
      }),
    );
    expect(cells).toContain(
      $prosary.number(1234.5, { style: "currency", currency: "USD" }),
    );
    expect(cells).toContain("1.5 kB");
    expect(cells).toContain("Yes");
    expect(cells).toContain("1");
  });
});
