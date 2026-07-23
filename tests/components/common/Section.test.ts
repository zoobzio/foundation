import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Section from "#foundation/components/common/section.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Section, { props, slots });

describe("Section", () => {
  it("renders a section element with f-section class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("SECTION");
    expect(wrapper.classes()).toContain("f-section");
  });

  it("binds aria-label from the aria channel", () => {
    const wrapper = factory({ aria: { label: "My Section" } });
    expect(wrapper.attributes("aria-label")).toBe("My Section");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "My Section" });
    expect(wrapper.text()).toBe("My Section");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "My Section" }, { default: "Custom content" });
    expect(wrapper.text()).toBe("Custom content");
  });
});
