// The scroller wrapper: `top` before the back-to-top label.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Scroller from "../../../app/components/scroller";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("scroller wrapper", () => {
  it("draws top before the back-to-top label once scrolled", async () => {
    const wrapper = mount(Scroller, {
      slots: { default: "<div style='height: 2000px'></div>" },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(wrapper.find("button").exists()).toBe(false);
    const viewport = wrapper.get<HTMLElement>(".f-scroll-area-viewport");
    Object.defineProperty(viewport.element, "scrollTop", {
      value: 120,
      configurable: true,
    });
    viewport.element.dispatchEvent(new Event("scroll"));
    await nextTick();
    const button = wrapper.get("button");
    expect(button.get("svg[data-icon]").attributes("data-icon")).toBe("top");
    expect(button.text()).toBe("Back to top");
  });
});
