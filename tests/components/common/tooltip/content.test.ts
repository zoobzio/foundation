import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Content from "#foundation/components/common/tooltip/content.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Content, { props, slots, global: { stubs: rekaStubs("TooltipContent") } });

describe("common/tooltip/Content", () => {
  it("renders with f-tooltip-content class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-tooltip-content");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ side: "top", sideOffset: 4 });
    expect(wrapper.attributes("side")).toBe("top");
    expect(wrapper.attributes("sideoffset")).toBe("4");
  });

  it("preserves reka's true-defaults by not forwarding cast booleans", () => {
    const wrapper = factory();
    expect(wrapper.attributes("avoidcollisions")).toBeUndefined();
  });

  it("forwards explicitly-set boolean overrides", () => {
    const wrapper = factory({ avoidCollisions: false });
    expect(wrapper.attributes("avoidcollisions")).toBe("false");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the tooltip role", () => {
    const wrapper = factory({ aria: { label: "Hint" } });
    expect(wrapper.attributes("aria-label")).toBe("Hint");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>hint</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
