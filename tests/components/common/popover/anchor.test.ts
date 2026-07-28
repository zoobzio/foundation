import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Anchor from "#foundation/components/common/popover/anchor.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Anchor, { props, slots, global: { stubs: rekaStubs("PopoverAnchor") } });

describe("common/popover/Anchor", () => {
  it("renders with f-popover-anchor class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-popover-anchor");
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

  it("renders the aria channel for the generic role", () => {
    const wrapper = factory({ aria: { hidden: true } });
    expect(wrapper.attributes("aria-hidden")).toBe("true");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>anchor</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
