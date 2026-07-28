import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Part from "#foundation/components/common/tabs/trigger.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Part, { props, slots, global: { stubs: rekaStubs("TabsTrigger") } });

describe("common/tabs/Trigger", () => {
  it("renders with f-tabs-trigger class", () => {
    const wrapper = factory({ value: "apple" });
    expect(wrapper.classes()).toContain("f-tabs-trigger");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ value: "apple", disabled: true });
    expect(wrapper.attributes("value")).toBe("apple");
    expect(wrapper.attributes("disabled")).toBe("true");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ value: "apple", tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel", () => {
    const wrapper = factory({ value: "apple", aria: { selected: true } });
    expect(wrapper.attributes("aria-selected")).toBe("true");
  });

  it("renders default slot content", () => {
    const wrapper = factory({ value: "apple" }, { default: "<b>content</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
