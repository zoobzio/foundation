// The directory wrapper: NuxtLink under the `link` part, select relayed.
import type {
  DirectoryGroup,
  DirectoryItem,
} from "@zoobzio/vue/types/components/directory";

import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Directory from "../../../app/components/directory";

type Entry = DirectoryItem & { section: string };

const groups: DirectoryGroup<Entry>[] = [
  {
    key: "workspace",
    label: "Workspace",
    items: [
      { key: "home", label: "Home", link: { to: "/" }, section: "w" },
      {
        key: "contacts",
        label: "Contacts",
        link: { to: "/contacts", target: "_blank" },
        section: "w",
      },
      {
        key: "off",
        label: "Off",
        disabled: true,
        link: { to: "/off" },
        section: "w",
      },
      { key: "plain", label: "Plain", section: "w", icon: "folder" },
    ],
  },
];

describe("directory wrapper", () => {
  it("draws an item's icon before its label", () => {
    const wrapper = mount(Directory<Entry>, { props: { groups } });
    const icons = wrapper.findAll("svg[data-icon]");
    expect(icons.map((i) => i.attributes("data-icon"))).toEqual(["folder"]);
    expect(icons[0]?.element.parentElement?.textContent).toContain("Plain");
  });

  it("renders linked items through NuxtLink with the recipe's attributes", () => {
    const wrapper = mount(Directory<Entry>, { props: { groups } });
    const links = wrapper.findAll("a[data-nuxt]");
    expect(links.map((a) => a.attributes("href"))).toEqual([
      "/",
      "/contacts",
      undefined,
    ]);
    expect(links[1]?.attributes("target")).toBe("_blank");
  });

  it("renders a disabled link through NuxtLink without an href", () => {
    const wrapper = mount(Directory<Entry>, { props: { groups } });
    const off = wrapper.findAll("a").find((a) => a.text() === "Off");
    expect(off?.attributes("data-nuxt")).toBe("");
    expect(off?.attributes("href")).toBeUndefined();
  });

  it("composes a consumer's pt.link and relays select", async () => {
    const wrapper = mount(Directory<Entry>, {
      props: { groups, pt: { link: () => ({ class: "custom" }) } },
    });
    const home = wrapper.get("a[data-nuxt]");
    expect(home.classes()).toContain("custom");
    await home.trigger("click");
    expect(wrapper.emitted("select")).toEqual([[groups[0]?.items[0]]]);
  });
});
