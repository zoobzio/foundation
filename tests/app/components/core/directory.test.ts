// Mount depth follows the behavior under test: the item-kind branch (Anchor
// vs Button), the disabled guards, and the select emit are the component's
// own logic; the elements underneath have their own suites. NuxtLink is the
// one framework global, stubbed to a bare <a> that maps `to` → `href`.
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent } from "vue";
import { mount } from "@vue/test-utils";
import Core from "../../../../app/components/core/directory.vue";
import { fakeDirectoryGroups } from "#test/data/directory";
import type { FakeEntry } from "#test/data/directory";
import type {
  DirectoryEmits,
  DirectoryProps,
} from "../../../../app/types/core/directory";

// Generic SFCs don't instantiate through mount()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates T for the harness.
const Directory: FunctionalComponent<
  DirectoryProps<FakeEntry>,
  DirectoryEmits<FakeEntry>
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

const item = (key: string): FakeEntry => {
  const found = fakeDirectoryGroups
    .flatMap((group) => group.items)
    .find((entry) => entry.key === key);
  if (!found) throw new Error(`no fixture item ${key}`);
  return found;
};

const mountDirectory = (
  props: Partial<DirectoryProps<FakeEntry>> = {},
  slots: Record<string, string> = {},
) => {
  return mount(Directory, {
    props: { groups: fakeDirectoryGroups, ...props },
    slots,
    global: { components: { NuxtLink } },
  });
};

describe("directory", () => {
  it("renders the semantic tree: nav, labeled groups, lists, items", () => {
    const wrapper = mountDirectory();
    expect(wrapper.get("nav").classes()).toContain("f-nav");
    const captions = wrapper.findAll(".f-caption");
    expect(captions.map((c) => c.text())).toEqual(["Workspace"]);
    expect(wrapper.findAll("ul")).toHaveLength(2);
    expect(wrapper.findAll("li")).toHaveLength(5);
  });

  it("link items render as hyperlinks, plain items as buttons", () => {
    const wrapper = mountDirectory();
    const anchors = wrapper.findAll("a");
    expect(anchors.map((a) => a.attributes("href"))).toEqual([
      "/",
      "/contacts",
      undefined,
    ]);
    expect(anchors.at(1)?.attributes("target")).toBe("_blank");
    expect(wrapper.findAll("button").map((b) => b.text())).toEqual([
      "Log out",
      "Danger",
    ]);
  });

  it("anchor activation emits select with the full consumer item", async () => {
    const wrapper = mountDirectory();
    await wrapper.get('a[href="/"]').trigger("click");
    expect(wrapper.emitted("select")).toEqual([[item("home")]]);
  });

  it("button activation emits select with the full consumer item", async () => {
    const wrapper = mountDirectory();
    const logout = wrapper
      .findAll("button")
      .find((b) => b.text() === "Log out");
    if (!logout) throw new Error("no logout button rendered");
    await logout.trigger("click");
    expect(wrapper.emitted("select")).toEqual([[item("logout")]]);
  });

  it("disabled items suppress navigation, activation, and select", async () => {
    const wrapper = mountDirectory();
    const billing = wrapper.findAll("a").at(2);
    if (!billing) throw new Error("no disabled anchor rendered");
    expect(billing.attributes("href")).toBeUndefined();
    await billing.trigger("click");
    const danger = wrapper.findAll("button").at(1);
    expect(danger?.attributes("disabled")).toBeDefined();
    expect(wrapper.emitted("select")).toBeUndefined();
  });

  it("pt overrides reach their part", () => {
    const wrapper = mountDirectory({
      pt: { itemIcon: () => ({ alias: "external" }) },
    });
    expect(wrapper.get("use").attributes("href")).toBe("/icons.svg#external");
  });

  it("serves ctx and the item to slot overrides", () => {
    const wrapper = mountDirectory(
      {},
      {
        item: `<template #item="s">
          <output>{{ s.item.key }}:{{ s.groups.length }}</output>
        </template>`,
      },
    );
    expect(
      wrapper.findAll("output").map((o) => o.text()),
    ).toEqual(["home:2", "contacts:2", "billing:2", "logout:2", "danger:2"]);
    expect(wrapper.findAll("a")).toHaveLength(0);
    expect(wrapper.findAll("button")).toHaveLength(0);
  });
});
