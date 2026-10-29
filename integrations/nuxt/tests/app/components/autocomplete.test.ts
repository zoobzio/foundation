// The autocomplete wrapper: the layer's Scroller as the active panel's
// viewport, so its back-to-top draws the `top` icon, `remove` after each
// chip's label, a field's `icon` before its option, and the branch arrows:
// `next` on a field or operator option, `expand` on the active trail
// option, none on a value.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { reactive } from "vue";
import { QueryService, createQueryState } from "@zoobzio/query";
import Autocomplete from "../../../app/components/autocomplete";
import { makeTable } from "#test/mount/table";

const makeQuery = () =>
  new QueryService(
    "test-query",
    {
      fields: {
        status: { label: "Status", values: ["Active"], icon: "filter" },
        amount: { label: "Amount", operators: ["over", "under"] },
      },
    },
    reactive(createQueryState()),
  );

/**
 * The icons of each rendered option, in order, by the option's class.
 */
const iconsOf = (
  wrapper: { findAll: (selector: string) => { element: Element }[] },
  selector: string,
) =>
  wrapper
    .findAll(selector)
    .map((item) =>
      Array.from(item.element.querySelectorAll("svg[data-icon]")).map((svg) =>
        svg.getAttribute("data-icon"),
      ),
    );

const mounted: { unmount: () => void }[] = [];

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      if (this.hasAttribute("data-reka-scroll-area-viewport")) return 280;
      if (this.hasAttribute("data-index")) return 28;
      return 0;
    },
  );
});

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("autocomplete wrapper", () => {
  it("draws a field's icon before its option and next after a branching option", async () => {
    const wrapper = mount(Autocomplete, {
      props: { service: makeQuery() },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await wrapper.get("input").setValue("a");
    await flushPromises();
    expect(iconsOf(wrapper, ".f-autocomplete-item")).toEqual([
      ["filter", "next"],
      ["next"],
    ]);
  });

  it("draws expand on the active trail option, next on operators, and nothing on a value", async () => {
    const service = makeQuery();
    const wrapper = mount(Autocomplete, {
      props: { service },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await wrapper.get("input").setValue("Amount: ");
    await flushPromises();
    expect(iconsOf(wrapper, ".f-button")).toEqual([["expand"]]);
    expect(iconsOf(wrapper, ".f-autocomplete-item")).toEqual([
      ["next"],
      ["next"],
    ]);
    await wrapper.get("input").setValue("Status: ");
    await flushPromises();
    expect(iconsOf(wrapper, ".f-button")).toEqual([["filter", "expand"]]);
    expect(iconsOf(wrapper, ".f-autocomplete-item")).toEqual([[]]);
  });

  it("draws remove after each chip's label", async () => {
    const { service } = makeTable();
    service.query.add({ kind: "text", value: "alice" });
    service.query.add({ kind: "filter", key: "name", value: "Bob" });
    const wrapper = mount(Autocomplete, {
      props: { service: service.query },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await flushPromises();
    const chips = wrapper.findAll(".f-chip");
    expect(chips).toHaveLength(2);
    for (const chip of chips) {
      expect(chip.element.lastElementChild?.getAttribute("data-icon")).toBe(
        "remove",
      );
    }
    await chips[0]!.trigger("click");
    expect(service.query.entries).toHaveLength(1);
  });

  it("renders the active panel in the layer's Scroller", async () => {
    const { service } = makeTable();
    const wrapper = mount(Autocomplete, {
      props: { service: service.query },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await wrapper.get("input").setValue("N");
    await flushPromises();
    const viewport = wrapper.get<HTMLElement>(
      ".f-autocomplete-viewport .f-scroll-area-viewport",
    );
    expect(viewport.get("[data-reka-virtualizer]").element.parentElement).toBe(
      viewport.element,
    );
    expect(wrapper.find(".f-autocomplete-item").text()).toBe("Name");
    Object.defineProperty(viewport.element, "scrollTop", {
      value: 40,
      configurable: true,
    });
    viewport.element.dispatchEvent(new Event("scroll"));
    await flushPromises();
    expect(wrapper.find('svg[data-icon="top"]').exists()).toBe(true);
  });
});
