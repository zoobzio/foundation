import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Caption from "#foundation/components/common/caption.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Caption, { props, slots });

describe("Caption", () => {
  it("renders a div element with f-caption class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-caption");
  });

  it("binds aria-label from the aria channel", () => {
    const wrapper = factory({ aria: { label: "My Caption" } });
    expect(wrapper.attributes("aria-label")).toBe("My Caption");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "My Caption" });
    expect(wrapper.text()).toBe("My Caption");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "My Caption" }, { default: "Custom content" });
    expect(wrapper.text()).toBe("Custom content");
  });
});
