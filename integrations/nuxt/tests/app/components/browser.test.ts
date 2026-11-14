// The browser wrapper: NuxtLink under the file rows' `link` part and the
// trail's, the search, sort, and head drawn with the layer's icons and
// text, the service events relayed.
import type { LinkedFile } from "#test/mount/browser";

import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Browser from "../../../app/components/browser";
import { $prosary } from "#test/mocks/app";
import { makeBrowser } from "#test/mount/browser";

const mounted: { unmount: () => void }[] = [];

const mountBrowser = (props: {
  service: ReturnType<typeof makeBrowser>["service"];
  pt?: object;
}) => {
  const wrapper = mount(Browser<LinkedFile>, {
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

describe("browser wrapper", () => {
  it("renders url cells through NuxtLink with the recipe's attributes", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountBrowser({ service });
    const links = wrapper.findAll("tbody a[data-nuxt]");
    expect(links.map((a) => a.attributes("href"))).toEqual([
      "https://cdn.example/logo.svg",
      "https://cdn.example/hero.png",
    ]);
    expect(links[0]?.attributes("target")).toBe("_blank");
  });

  it("composes a consumer's pt.files.link over NuxtLink", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountBrowser({
      service,
      pt: { files: { link: () => ({ class: "custom" }) } },
    });
    expect(wrapper.get("tbody a[data-nuxt]").classes()).toContain("custom");
  });

  it("renders a linked crumb of the trail through NuxtLink", async () => {
    const { service } = makeBrowser();
    await service.init();
    const wrapper = mountBrowser({
      service,
      pt: {
        head: {
          breadcrumb: {
            items: [
              { key: "root", label: "Root", index: 0, link: { to: "/files" } },
              { key: "here", label: "Here", index: 1 },
            ],
          },
        },
      },
    });
    const crumb = wrapper.get("nav a[data-nuxt]");
    expect(crumb.attributes("href")).toBe("/files");
    expect(crumb.text()).toBe("Root");
  });

  it("draws the refresh, folder, and action icons", async () => {
    const { service } = makeBrowser(
      {
        actions: { open: { label: "Open" } },
        folderActions: { rename: { label: "Rename" } },
      },
      { actions: { open: vi.fn() }, folderActions: { rename: vi.fn() } },
    );
    await service.init();
    const wrapper = mountBrowser({ service });
    expect(
      wrapper
        .get('button[aria-label="Refresh"] svg[data-icon]')
        .attributes("data-icon"),
    ).toBe("refresh");
    const folders = wrapper.findAll(".f-data-browser-folder-btn");
    expect(folders.length).toBeGreaterThan(0);
    for (const folder of folders) {
      expect(folder.get("svg[data-icon]").attributes("data-icon")).toBe(
        "folder",
      );
    }
    const triggers = wrapper.findAll('button[aria-label="Actions"]');
    expect(triggers.length).toBe(folders.length + 2);
    for (const trigger of triggers) {
      expect(trigger.get("svg[data-icon]").attributes("data-icon")).toBe(
        "actions",
      );
      expect(trigger.text()).toBe("");
    }
  });

  it("draws the search as the table's is drawn, in the browser's words", () => {
    const { service } = makeBrowser();
    const wrapper = mountBrowser({ service });
    const search = wrapper.get(".f-data-browser-search");
    expect(search.get("svg[data-icon]").attributes("data-icon")).toBe("magic");
    expect(search.get("input").attributes("placeholder")).toBe(
      "Search this folder...",
    );
    expect(search.get("kbd").text()).toBe("/");
  });

  it("opens the trail with the open folder and counts the listing after it", async () => {
    const { service } = makeBrowser();
    await service.init();
    service.open({ key: "media", label: "Media" });
    await flushPromises();
    const wrapper = mountBrowser({ service });
    const crumbs = wrapper.findAll("thead .f-data-browser-breadcrumb li");
    expect(crumbs.map((li) => li.text())).toEqual(["Home", "Media"]);
    expect(crumbs[0]!.get("svg[data-icon]").attributes("data-icon")).toBe(
      "folder-open",
    );
    expect(crumbs[1]!.find("svg[data-icon]").exists()).toBe(false);
    expect(wrapper.get("thead .f-data-browser-summary").text()).toBe(
      "2 folders, 2 files",
    );
  });

  it("counts one folder and one file in the singular", async () => {
    const { service } = makeBrowser(
      {},
      {},
      {
        folders: [{ key: "a", label: "A" }],
        files: [{ id: 1, name: "a", url: "https://cdn.example/a" }],
      },
    );
    await service.init();
    const wrapper = mountBrowser({ service });
    expect(wrapper.get(".f-data-browser-summary").text()).toBe(
      "1 folder, 1 file",
    );
  });

  it("draws the sort trigger by the files' sort and marks the sorted column", async () => {
    const { service } = makeBrowser({
      columns: [
        { key: "name", label: "Name", sortable: true },
        { key: "url", label: "URL", type: "url", sortable: true },
      ],
    });
    await service.init();
    const wrapper = mountBrowser({ service });
    const trigger = wrapper.get('button[aria-label="Sort"]');
    expect(trigger.text()).toBe("");
    expect(trigger.get("svg[data-icon]").attributes("data-icon")).toBe("sort");
    service.sortBy("name");
    await flushPromises();
    expect(trigger.get("svg[data-icon]").attributes("data-icon")).toBe(
      "sort-asc",
    );
    await trigger.trigger("click", { button: 0, ctrlKey: false });
    await flushPromises();
    const items = Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    expect(items.map((el) => el.textContent?.trim())).toEqual(["Name", "URL"]);
    expect(
      items.map((el) => el.querySelector("svg")?.getAttribute("data-icon")),
    ).toEqual(["sort-asc", undefined]);
    service.sortBy("name");
    await flushPromises();
    expect(trigger.get("svg[data-icon]").attributes("data-icon")).toBe(
      "sort-desc",
    );
  });

  it("relays the service's domain events", async () => {
    const { service } = makeBrowser();
    const wrapper = mountBrowser({ service });
    await service.init();
    const updated = wrapper.emitted("updated")?.at(0)?.at(0);
    expect(updated).toMatchObject({ id: "test-browser" });
  });

  it("reads its empty state from the contract", async () => {
    const { service } = makeBrowser({}, {}, { folders: [], files: [] });
    await service.init();
    const wrapper = mountBrowser({ service });
    await flushPromises();
    expect(wrapper.get(".f-data-browser-empty").text()).toBe("Empty folder");
    service.query.add({ kind: "literal", key: "text", value: "zzz" });
    await flushPromises();
    expect(wrapper.get(".f-data-browser-empty").text()).toBe("No matches");
  });

  it("formats typed cells through the app's prosary service", async () => {
    const { service } = makeBrowser({
      columns: [
        { key: "id", label: "ID", type: "number" },
        { key: "name", label: "Name", type: "boolean" },
      ],
    });
    await service.init();
    const wrapper = mountBrowser({ service });
    await flushPromises();
    const cells = wrapper.findAll("tbody td").map((td) => td.text());
    expect(cells).toContain("1");
    expect(cells).toContain("Yes");
  });

  it("formats date and datetime cells in the browser's time zone", async () => {
    // The 5th, early, in the zone; the 4th in UTC, and wherever the tests run.
    const timeZone = "Pacific/Kiritimati";
    const at = "2025-11-04T13:05:00Z";
    const { service } = makeBrowser(
      {
        columns: [
          { key: "name", label: "When", type: "datetime" },
          { key: "url", label: "Day", type: "date" },
        ],
        timeZone,
      },
      {},
      { folders: [], files: [{ id: 1, name: at, url: at }] },
    );
    await service.init();
    const wrapper = mountBrowser({ service });
    await flushPromises();
    const cells = wrapper.findAll("tbody td").map((td) => td.text());
    const date = $prosary.date(new Date(at), { timeZone });
    const time = $prosary.time(new Date(at), { timeZone });
    expect(date).not.toBe($prosary.date(new Date(at), { timeZone: "UTC" }));
    expect(cells).toContain(`${date} ${time}`);
    expect(cells).toContain(date);
  });
});
