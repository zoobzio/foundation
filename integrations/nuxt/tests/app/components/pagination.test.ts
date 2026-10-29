// The pagination wrapper: `first`, `prev`, `next`, and `last` as the page
// controls' content, the layer's Select as the size control.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Pagination from "../../../app/components/pagination";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("pagination wrapper", () => {
  it("draws the page controls as icons, keeping their labels as names", async () => {
    const wrapper = mount(Pagination, {
      props: { page: 2, count: 5, total: 50 },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    for (const name of ["First", "Previous", "Next", "Last"]) {
      const button = wrapper.get(`button[aria-label="${name}"]`);
      expect(button.text()).toBe("");
      expect(button.get("svg[data-icon]").attributes("data-icon")).toBe(
        { First: "first", Previous: "prev", Next: "next", Last: "last" }[name],
      );
    }
    await wrapper.get('button[aria-label="Next"]').trigger("click");
    expect(wrapper.emitted("update:page")?.at(0)).toEqual([3]);
  });

  it("renders the size control through the layer's Select", () => {
    const wrapper = mount(Pagination, {
      props: { count: 5, total: 50 },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(
      wrapper
        .get("button.f-select-trigger svg[data-icon]")
        .attributes("data-icon"),
    ).toBe("expand");
  });

  it("lets a consumer's first slot win", () => {
    const wrapper = mount(Pagination, {
      props: { count: 5, total: 50 },
      slots: { first: "<b>|&lt;</b>" },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(wrapper.find('button[aria-label="First"]').exists()).toBe(false);
    expect(wrapper.get("b").text()).toBe("|<");
  });
});
