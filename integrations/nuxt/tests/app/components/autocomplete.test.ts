// The autocomplete wrapper: the layer's Scroller as the active panel's
// viewport, so its back-to-top draws the `top` icon.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Autocomplete from "../../../app/components/autocomplete";
import { makeTable } from "#test/mount/table";

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
