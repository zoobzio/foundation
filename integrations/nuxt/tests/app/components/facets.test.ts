// The facets wrapper: `filter` as the trigger's content, the layer's
// Command behind it so a facet's `icon` draws.
import type {
  FacetGroup,
  FacetItem,
} from "@zoobzio/vue/types/components/facets";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Facets from "../../../app/components/facets";

const groups: FacetGroup<FacetItem>[] = [
  {
    key: "kind",
    label: "Kind",
    items: [
      { value: "doc", label: "Document", count: 3, icon: "folder" },
      { value: "img", label: "Image", count: 1 },
    ],
  },
];

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});
const iconsOf = (root: { querySelectorAll: ParentNode["querySelectorAll"] }) =>
  Array.from(root.querySelectorAll<SVGElement>("svg[data-icon]")).map((svg) =>
    svg.getAttribute("data-icon"),
  );

describe("facets wrapper", () => {
  it("draws filter as the trigger's content, keeping its label as the name", () => {
    const wrapper = mount(Facets<FacetItem>, {
      props: { groups },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const trigger = wrapper.get('button[aria-label="Filters"]');
    expect(iconsOf(trigger.element)).toEqual(["filter"]);
    expect(trigger.text()).toBe("");
  });

  it("renders the command through the layer's, with search and item icons", async () => {
    const wrapper = mount(Facets<FacetItem>, {
      props: { groups, open: true },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await flushPromises();
    const filter = document.body.querySelector(".f-listbox-filter");
    expect(filter?.previousElementSibling?.getAttribute("data-icon")).toBe(
      "search",
    );
    const options = Array.from(
      document.body.querySelectorAll('[role="option"]'),
    );
    expect(options.map((o) => iconsOf(o))).toEqual([
      ["check", "folder"],
      ["check"],
    ]);
  });
});
