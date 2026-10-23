// The breadcrumb wrapper: the vue breadcrumb with NuxtLink laid under its
// `link` part. Props, emits, slots, attrs, and `ctx` pass through whole.
import type { BreadcrumbItem } from "@zoobzio/vue/types/components/breadcrumb";

import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Breadcrumb from "../../../app/components/breadcrumb.vue";

type Crumb = BreadcrumbItem & { depth: number };

const crumbs: Crumb[] = [
  { key: "root", label: "Home", depth: 0, link: { to: "/" } },
  { key: "docs", label: "Docs", depth: 1 },
  {
    key: "legacy",
    label: "Legacy",
    depth: 2,
    disabled: true,
    link: { to: "/legacy" },
  },
  { key: "current", label: "Current Page", depth: 3 },
];

describe("breadcrumb wrapper", () => {
  it("renders a linked ancestor through NuxtLink with the recipe's href", () => {
    const wrapper = mount(Breadcrumb<Crumb>, { props: { items: crumbs } });
    const links = wrapper.findAll("a[data-nuxt]");
    expect(links.map((a) => a.attributes("href"))).toEqual(["/", undefined]);
    expect(links[0]?.classes()).toContain("f-anchor");
  });

  it("renders a disabled link through NuxtLink without an href", () => {
    const wrapper = mount(Breadcrumb<Crumb>, { props: { items: crumbs } });
    const legacy = wrapper.findAll("li").at(2)?.get("a");
    expect(legacy?.attributes("data-nuxt")).toBe("");
    expect(legacy?.attributes("href")).toBeUndefined();
  });

  it("composes a consumer's pt.link over NuxtLink", () => {
    const wrapper = mount(Breadcrumb<Crumb>, {
      props: { items: crumbs, pt: { link: () => ({ class: "custom" }) } },
    });
    const link = wrapper.get("a[data-nuxt]");
    expect(link.attributes("href")).toBe("/");
    expect(link.classes()).toContain("custom");
  });

  it("lets a consumer swap NuxtLink out through pt.link", () => {
    const wrapper = mount(Breadcrumb<Crumb>, {
      props: { items: crumbs, pt: { link: () => ({ as: "span" }) } },
    });
    expect(wrapper.find("a[data-nuxt]").exists()).toBe(false);
    expect(wrapper.get("span.f-anchor").text()).toBe("Home");
  });

  it("relays select with the item", async () => {
    const wrapper = mount(Breadcrumb<Crumb>, { props: { items: crumbs } });
    await wrapper.get("a[data-nuxt]").trigger("click");
    expect(wrapper.emitted("select")).toEqual([[crumbs[0]]]);
  });

  it("forwards slots with their scope", () => {
    const wrapper = mount(Breadcrumb<Crumb>, {
      props: { items: crumbs },
      slots: {
        itemLabel: `<template #itemLabel="{ item, index }"><b class="lbl">{{ index }}:{{ item.label }}</b></template>`,
      },
    });
    expect(wrapper.findAll("b.lbl").map((b) => b.text())).toEqual([
      "0:Home",
      "1:Docs",
      "2:Legacy",
      "3:Current Page",
    ]);
  });

  it("forwards attrs to the wrapped component's root", () => {
    const wrapper = mount(Breadcrumb<Crumb>, {
      props: { items: crumbs },
      attrs: { id: "trail", class: "custom", "data-x": "1" },
    });
    const nav = wrapper.get("nav");
    expect(nav.attributes("id")).toBe("trail");
    expect(nav.classes()).toContain("custom");
    expect(nav.attributes("data-x")).toBe("1");
  });

  it("exposes the wrapped component's ctx", () => {
    const wrapper = mount(Breadcrumb<Crumb>, { props: { items: crumbs } });
    const { ctx } = wrapper.vm as { ctx?: { id: string; items: Crumb[] } };
    expect(ctx?.id).toBe("breadcrumb");
    expect(ctx?.items).toHaveLength(4);
  });
});
