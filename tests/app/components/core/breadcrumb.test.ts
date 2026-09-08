// Mount depth follows the behavior under test: the terminal-vs-ancestor
// branch, the link/button duality, the disabled guards, and the select emit
// are the component's own logic. NuxtLink is the one framework global,
// stubbed to a bare <a> that maps `to` → `href`.
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent } from "vue";
import { mount } from "@vue/test-utils";
import Core from "../../../../app/components/core/breadcrumb.vue";
import { fakeCrumbs } from "#test/data/breadcrumb";
import type { FakeCrumb } from "#test/data/breadcrumb";
import type {
  BreadcrumbEmits,
  BreadcrumbProps,
} from "../../../../app/types/core/breadcrumb";

// Generic SFCs don't instantiate through mount()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates T for the harness.
const Breadcrumb: FunctionalComponent<
  BreadcrumbProps<FakeCrumb>,
  BreadcrumbEmits<FakeCrumb>
> = Core;

const NuxtLink = defineComponent({
  name: "NuxtLink",
  props: {
    to: { type: String, default: undefined },
    external: { type: Boolean, default: undefined },
    target: { type: String, default: undefined },
    replace: { type: Boolean, default: undefined },
    prefetch: { type: Boolean, default: undefined },
  },
  setup(props, { slots }) {
    return () =>
      h("a", { href: props.to, target: props.target }, slots.default?.());
  },
});

const crumb = (key: string): FakeCrumb => {
  const found = fakeCrumbs.find((entry) => entry.key === key);
  if (!found) throw new Error(`no fixture crumb ${key}`);
  return found;
};

const mountBreadcrumb = (
  props: Partial<BreadcrumbProps<FakeCrumb>> = {},
  slots: Record<string, string> = {},
) => {
  return mount(Breadcrumb, {
    props: { items: fakeCrumbs, ...props },
    slots,
    global: { components: { NuxtLink } },
  });
};

describe("breadcrumb", () => {
  it("renders the semantic trail: labeled nav, ordered list, items", () => {
    const wrapper = mountBreadcrumb();
    const nav = wrapper.get("nav");
    expect(nav.classes()).toContain("f-nav");
    expect(nav.attributes("aria-label")).toBe("Breadcrumb");
    expect(wrapper.findAll("ol")).toHaveLength(1);
    expect(wrapper.findAll("li")).toHaveLength(4);
  });

  it("the last item is inert text marked as the current page", () => {
    const wrapper = mountBreadcrumb();
    const current = wrapper.get('[aria-current="page"]');
    expect(current.element.tagName).toBe("SPAN");
    expect(current.text()).toBe("Current Page");
    const last = wrapper.findAll("li").at(3);
    expect(last?.find("a").exists()).toBe(false);
    expect(last?.find("button").exists()).toBe(false);
  });

  it("ancestors render as hyperlinks when linked, buttons otherwise", () => {
    const wrapper = mountBreadcrumb();
    const anchors = wrapper.findAll("a");
    expect(anchors.map((a) => a.attributes("href"))).toEqual(["/"]);
    expect(wrapper.findAll("button").map((b) => b.text())).toEqual([
      "Docs",
      "Legacy",
    ]);
  });

  it("renders a separator after every item but the last", () => {
    const wrapper = mountBreadcrumb();
    const chevrons = wrapper
      .findAll("use")
      .filter((u) => u.attributes("href") === "#chevron-right");
    expect(chevrons).toHaveLength(3);
    const last = wrapper.findAll("li").at(3);
    expect(last?.find('use[href="#chevron-right"]').exists()).toBe(false);
  });

  it("anchor activation emits select with the full consumer item", async () => {
    const wrapper = mountBreadcrumb();
    await wrapper.get('a[href="/"]').trigger("click");
    expect(wrapper.emitted("select")).toEqual([[crumb("root")]]);
  });

  it("button activation emits select with the full consumer item", async () => {
    const wrapper = mountBreadcrumb();
    const docs = wrapper.findAll("button").find((b) => b.text() === "Docs");
    if (!docs) throw new Error("no docs button rendered");
    await docs.trigger("click");
    expect(wrapper.emitted("select")).toEqual([[crumb("docs")]]);
  });

  it("disabled items suppress activation and select", async () => {
    const wrapper = mountBreadcrumb();
    const legacy = wrapper.findAll("button").find((b) => b.text() === "Legacy");
    if (!legacy) throw new Error("no legacy button rendered");
    expect(legacy.attributes("disabled")).toBeDefined();
    await legacy.trigger("click");
    expect(wrapper.emitted("select")).toBeUndefined();
  });

  it("serves ctx, the item, and its position to slot overrides", () => {
    const wrapper = mountBreadcrumb(
      {},
      {
        item: `<template #item="s">
          <output>{{ s.item.key }}:{{ s.index }}:{{ s.last }}:{{ s.items.length }}</output>
        </template>`,
      },
    );
    expect(wrapper.findAll("output").map((o) => o.text())).toEqual([
      "root:0:false:4",
      "docs:1:false:4",
      "legacy:2:false:4",
      "current:3:true:4",
    ]);
    expect(wrapper.findAll("a")).toHaveLength(0);
    expect(wrapper.findAll("button")).toHaveLength(0);
  });

  it("separator overrides replace the default chevron", () => {
    const wrapper = mountBreadcrumb(
      {},
      {
        separator: `<template #separator="s">
          <output>sep:{{ s.index }}</output>
        </template>`,
      },
    );
    expect(wrapper.findAll("output").map((o) => o.text())).toEqual([
      "sep:0",
      "sep:1",
      "sep:2",
    ]);
    expect(wrapper.find('use[href="#chevron-right"]').exists()).toBe(false);
  });
});
