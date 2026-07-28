import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Part from "#foundation/components/common/scroll-area/scrollbar.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Part, { props, slots, global: { stubs: rekaStubs("ScrollAreaScrollbar") } });

describe("common/scroll-area/Scrollbar", () => {
  it("renders with f-scroll-area-scrollbar class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-scroll-area-scrollbar");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ asChild: true });
    expect(wrapper.attributes("aschild")).toBe("true");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel", () => {
    const wrapper = factory({ aria: { orientation: "vertical" } });
    expect(wrapper.attributes("aria-orientation")).toBe("vertical");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>content</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
