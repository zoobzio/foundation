import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Container from "#foundation/components/common/container.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Container, { props, slots });

describe("Container", () => {
  it("renders a div element with f-container class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-container");
  });

  it("binds aria-label from the aria channel", () => {
    const wrapper = factory({ aria: { label: "My Container" } });
    expect(wrapper.attributes("aria-label")).toBe("My Container");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "My Container" });
    expect(wrapper.text()).toBe("My Container");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "My Container" }, { default: "Custom content" });
    expect(wrapper.text()).toBe("Custom content");
  });
});
