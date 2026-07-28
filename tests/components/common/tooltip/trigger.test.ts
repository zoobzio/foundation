import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Trigger from "#foundation/components/common/tooltip/trigger.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Trigger, { props, slots, global: { stubs: rekaStubs("TooltipTrigger") } });

describe("common/tooltip/Trigger", () => {
  it("renders with f-tooltip-trigger class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-tooltip-trigger");
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

  it("renders the aria channel for the button role", () => {
    const wrapper = factory({ aria: { expanded: true } });
    expect(wrapper.attributes("aria-expanded")).toBe("true");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>anchor</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
