// The table wrapper: NuxtLink under the body's `link` part, row actions
// through the layer's Menu with their icons, the toolbar, head, and
// pagination icons, the search with its `magic` icon, `/` hint, and `/`
// focus key, the service events relayed.
import type { LinkedRow } from "#test/mount/table";

import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Table from "../../../app/components/table";
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

  it("draws magic before the search input and the / hint after it", async () => {
    const { service } = makeTable();
    await service.init();
    const wrapper = mountTable({ service });
    const input = wrapper.get(".f-data-table-search input").element;
    const lead = input.parentElement?.firstElementChild;
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
      input.element.parentElement?.firstElementChild?.getAttribute("data-icon"),
    ).toBe("magic");
  });

  it("relays the service's domain events", async () => {
    const { service } = makeTable();
    const wrapper = mountTable({ service });
    await service.init();
    const updated = wrapper.emitted("updated")?.at(0)?.at(0);
    expect(updated).toMatchObject({ id: "test-table", total: 2 });
  });
});
