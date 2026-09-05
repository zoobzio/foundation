// Core component test in the select.test.ts mold: reka renders real DOM,
// interactions drive TreeRoot/TreeItem for real. NuxtLink is the one
// framework global, stubbed to a bare <a> that maps `to` → `href`.
import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import Core from "../../../../app/components/core/tree.vue";
import { fakeTreeNodes } from "#test/data/tree";
import type { FakeTreeNode } from "#test/data/tree";
import type { TreeEmits, TreeProps } from "../../../../app/types/core/tree";

// Generic SFCs don't instantiate through mount()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates T for the harness.
const Tree: FunctionalComponent<
  TreeProps<FakeTreeNode>,
  TreeEmits<FakeTreeNode>
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

const node = (key: string): FakeTreeNode => {
  const walk = (nodes: FakeTreeNode[]): FakeTreeNode | undefined => {
    for (const entry of nodes) {
      if (entry.key === key) return entry;
      const found = entry.children && walk(entry.children);
      if (found) return found;
    }
    return undefined;
  };
  const found = walk(fakeTreeNodes);
  if (!found) throw new Error(`no fixture node ${key}`);
  return found;
};

const mounted: { unmount: () => void }[] = [];

const mountTree = (
  props: Partial<TreeProps<FakeTreeNode>> = {},
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(Tree, {
    props: { items: fakeTreeNodes, ...props },
    slots,
    global: { components: { NuxtLink } },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

const itemByText = (
  wrapper: ReturnType<typeof mountTree>,
  label: string,
) => {
  const found = wrapper
    .findAll('[role="treeitem"]')
    .find((i) => i.text().includes(label));
  if (!found) throw new Error(`no rendered tree item "${label}"`);
  return found;
};

describe("tree", () => {
  it("renders a tree of top-level items with collapsed branches absent", () => {
    const wrapper = mountTree();
    const root = wrapper.get('[role="tree"]');
    expect(root.element.tagName).toBe("UL");
    expect(root.classes()).toContain("f-tree-root");
    const items = wrapper.findAll('[role="treeitem"]');
    expect(items).toHaveLength(3);
    expect(items.every((i) => i.element.tagName === "LI")).toBe(true);
    expect(items.map((i) => i.attributes("aria-level"))).toEqual([
      "1",
      "1",
      "1",
    ]);
  });

  it("controlled expansion mounts nested items with their depth", () => {
    const wrapper = mountTree({ expanded: ["guides"] });
    const items = wrapper.findAll('[role="treeitem"]');
    expect(items).toHaveLength(5);
    expect(itemByText(wrapper, "Introduction").attributes("aria-level")).toBe(
      "2",
    );
    expect(
      itemByText(wrapper, "Guides").attributes("aria-expanded"),
    ).toBe("true");
  });

  it("branch activation emits expansion, post-toggle state, and selection", async () => {
    const wrapper = mountTree();
    await itemByText(wrapper, "Guides").trigger("click");
    await flushPromises();
    expect(wrapper.emitted("update:expanded")).toEqual([[["guides"]]]);
    expect(wrapper.emitted("toggle")).toEqual([[node("guides"), true]]);
    // reka fires select on branch clicks too — part of the documented
    // contract, so lazy-load consumers key off toggle.
    expect(wrapper.emitted("select")).toEqual([[node("guides")]]);

    await itemByText(wrapper, "Guides").trigger("click");
    await flushPromises();
    expect(wrapper.emitted("update:expanded")).toEqual([[["guides"]], [[]]]);
    expect(wrapper.emitted("toggle")).toEqual([
      [node("guides"), true],
      [node("guides"), false],
    ]);
  });

  it("leaf activation emits the model and select, never toggle", async () => {
    const wrapper = mountTree({ expanded: ["guides"] });
    await itemByText(wrapper, "Introduction").trigger("click");
    await flushPromises();
    expect(wrapper.emitted("update:modelValue")).toEqual([[node("intro")]]);
    expect(wrapper.emitted("select")).toEqual([[node("intro")]]);
    expect(wrapper.emitted("toggle")).toBeUndefined();
  });

  it("the controlled model marks its item selected", () => {
    const wrapper = mountTree({ modelValue: node("reference") });
    expect(
      itemByText(wrapper, "Reference").attributes("aria-selected"),
    ).toBe("true");
    expect(itemByText(wrapper, "Archive").attributes("aria-selected")).toBe(
      "false",
    );
  });

  it("link nodes render as hyperlinks, plain nodes as text", () => {
    const wrapper = mountTree();
    const reference = itemByText(wrapper, "Reference").get("a");
    expect(reference.classes()).toContain("f-anchor");
    expect(reference.attributes("href")).toBe("/reference");
    expect(reference.attributes("target")).toBe("_blank");
    expect(itemByText(wrapper, "Guides").find("a").exists()).toBe(false);
    expect(
      itemByText(wrapper, "Guides").get("span").classes(),
    ).toContain("f-span");
  });

  it("branch nodes show a chevron that follows expansion", async () => {
    const wrapper = mountTree();
    expect(
      itemByText(wrapper, "Guides").get("use").attributes("href"),
    ).toBe("#chevron-right");
    expect(itemByText(wrapper, "Reference").find("use").exists()).toBe(false);
    await itemByText(wrapper, "Guides").trigger("click");
    await flushPromises();
    expect(
      itemByText(wrapper, "Guides").get("use").attributes("href"),
    ).toBe("#chevron-down");
  });

  it("disabled nodes stay inert", async () => {
    const wrapper = mountTree();
    const archive = itemByText(wrapper, "Archive");
    expect(archive.attributes("aria-disabled")).toBe("true");
    await archive.trigger("click");
    await flushPromises();
    expect(wrapper.emitted("select")).toBeUndefined();
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("pt overrides reach their part", () => {
    const wrapper = mountTree({ pt: { root: { disabled: true } } });
    const items = wrapper.findAll('[role="treeitem"]');
    expect(
      items.every((i) => i.attributes("aria-disabled") === "true"),
    ).toBe(true);
  });

  it("serves ctx, the flattened item, and expansion state to slot overrides", () => {
    const wrapper = mountTree(
      { expanded: ["guides"] },
      {
        item: `<template #item="s">
          <output>{{ s.item.value.key }}:{{ s.item.level }}:{{ s.isExpanded }}:{{ s.items.length }}</output>
        </template>`,
      },
    );
    expect(wrapper.findAll("output").map((o) => o.text())).toEqual([
      "guides:1:true:3",
      "intro:2:false:3",
      "advanced:2:false:3",
      "reference:1:false:3",
      "archive:1:false:3",
    ]);
  });
});
