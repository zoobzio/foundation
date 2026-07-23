import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Nav from "#foundation/components/common/nav.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Nav, { props, slots });

describe("Nav", () => {
  it("renders a nav element with f-nav class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("NAV");
    expect(wrapper.classes()).toContain("f-nav");
  });

  it("binds aria-label from the aria channel", () => {
    const wrapper = factory({ aria: { label: "My Nav" } });
    expect(wrapper.attributes("aria-label")).toBe("My Nav");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "My Nav" });
    expect(wrapper.text()).toBe("My Nav");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "My Nav" }, { default: "Custom content" });
    expect(wrapper.text()).toBe("Custom content");
  });
});
