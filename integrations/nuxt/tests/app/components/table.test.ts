// The table wrapper: NuxtLink under the body's `link` part, row actions
// through the layer's Menu with their icons, the service events relayed.
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

  it("relays the service's domain events", async () => {
    const { service } = makeTable();
    const wrapper = mountTable({ service });
    await service.init();
    const updated = wrapper.emitted("updated")?.at(0)?.at(0);
    expect(updated).toMatchObject({ id: "test-table", total: 2 });
  });
});
