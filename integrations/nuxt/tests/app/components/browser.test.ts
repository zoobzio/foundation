// The browser wrapper: NuxtLink under the file rows' `link` part and the
// trail's, the service events relayed.
import type { LinkedFile } from "#test/mount/browser";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Browser from "../../../app/components/browser.vue";
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
        breadcrumb: {
          items: [
            { key: "root", label: "Root", index: 0, link: { to: "/files" } },
            { key: "here", label: "Here", index: 1 },
          ],
        },
      },
    });
    const crumb = wrapper.get("nav a[data-nuxt]");
    expect(crumb.attributes("href")).toBe("/files");
    expect(crumb.text()).toBe("Root");
  });

  it("relays the service's domain events", async () => {
    const { service } = makeBrowser();
    const wrapper = mountBrowser({ service });
    await service.init();
    const updated = wrapper.emitted("updated")?.at(0)?.at(0);
    expect(updated).toMatchObject({ id: "test-browser" });
  });
});
