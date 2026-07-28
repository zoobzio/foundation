import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Part from "#foundation/components/common/tabs/content.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Part, { props, slots, global: { stubs: rekaStubs("TabsContent") } });

describe("common/tabs/Content", () => {
  it("renders with f-tabs-content class", () => {
    const wrapper = factory({ value: "apple" });
    expect(wrapper.classes()).toContain("f-tabs-content");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ value: "apple" });
    expect(wrapper.attributes("value")).toBe("apple");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ value: "apple", tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel", () => {
    const wrapper = factory({ value: "apple", aria: { label: "Panel" } });
    expect(wrapper.attributes("aria-label")).toBe("Panel");
  });

  it("renders default slot content", () => {
    const wrapper = factory({ value: "apple" }, { default: "<b>content</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
