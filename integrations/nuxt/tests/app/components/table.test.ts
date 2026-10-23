// The table wrapper: NuxtLink under the body's `link` part, the service
// events relayed.
import type { LinkedRow } from "#test/mount/table";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Table from "../../../app/components/table.vue";
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

  it("relays the service's domain events", async () => {
    const { service } = makeTable();
    const wrapper = mountTable({ service });
    await service.init();
    const updated = wrapper.emitted("updated")?.at(0)?.at(0);
    expect(updated).toMatchObject({ id: "test-table", total: 2 });
  });
});
