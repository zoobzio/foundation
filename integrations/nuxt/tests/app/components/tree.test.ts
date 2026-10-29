// The tree wrapper: NuxtLink under the `link` part, `expand` as each
// branch's toggle, the four emits relayed.
import type { TreeNode } from "@zoobzio/vue/types/components/tree";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Tree from "../../../app/components/tree";

type Node = TreeNode & { slug: string; children?: Node[] };

const nodes: Node[] = [
  {
    key: "guides",
    label: "Guides",
    slug: "guides",
    children: [
      {
        key: "intro",
        label: "Introduction",
        slug: "intro",
        link: { to: "/intro" },
      },
      {
        key: "old",
        label: "Old",
        slug: "old",
        disabled: true,
        link: { to: "/old" },
      },
    ],
  },
  {
    key: "reference",
    label: "Reference",
    slug: "reference",
    link: { to: "/reference" },
  },
];

const mounted: { unmount: () => void }[] = [];

const mountTree = (props: { expanded?: string[]; pt?: object } = {}) => {
  const wrapper = mount(Tree<Node>, {
    props: { items: nodes, ...props },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

const itemByText = (wrapper: ReturnType<typeof mountTree>, label: string) => {
  const found = wrapper
    .findAll('[role="treeitem"]')
    .find((i) => i.text().includes(label));
  if (!found) throw new Error(`no rendered tree item "${label}"`);
  return found;
};

describe("tree wrapper", () => {
  it("draws expand as a branch's toggle and nothing on a leaf", () => {
    const wrapper = mountTree();
    const items = wrapper.findAll(".f-tree-item");
    const guides = items.find((i) => i.text().includes("Guides"));
    const reference = items.find((i) => i.text().includes("Reference"));
    expect(guides?.get("svg[data-icon]").attributes("data-icon")).toBe(
      "expand",
    );
    expect(reference?.find("svg").exists()).toBe(false);
  });

  it("renders linked nodes through NuxtLink, a disabled one without an href", () => {
    const wrapper = mountTree({ expanded: ["guides"] });
    const intro = itemByText(wrapper, "Introduction").get("a");
    expect(intro.attributes("data-nuxt")).toBe("");
    expect(intro.attributes("href")).toBe("/intro");
    const old = itemByText(wrapper, "Old").get("a");
    expect(old.attributes("data-nuxt")).toBe("");
    expect(old.attributes("href")).toBeUndefined();
  });

  it("composes a consumer's pt.link over NuxtLink", () => {
    const wrapper = mountTree({ pt: { link: () => ({ class: "custom" }) } });
    const reference = itemByText(wrapper, "Reference").get("a[data-nuxt]");
    expect(reference.classes()).toContain("custom");
  });

  it("relays expansion, toggle, and selection", async () => {
    const wrapper = mountTree();
    await itemByText(wrapper, "Guides").trigger("click");
    await flushPromises();
    expect(wrapper.emitted("update:expanded")).toEqual([[["guides"]]]);
    expect(wrapper.emitted("toggle")).toEqual([[nodes[0], true]]);
    expect(wrapper.emitted("select")).toEqual([[nodes[0]]]);
    expect(wrapper.emitted("update:modelValue")).toEqual([[nodes[0]]]);
  });
});
