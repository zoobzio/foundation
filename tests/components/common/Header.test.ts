import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Header from "#foundation/components/common/Header.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Header, { props, slots });

describe("Header", () => {
  it("renders a header element with f-header class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("HEADER");
    expect(wrapper.classes()).toContain("f-header");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = factory({ label: "My Header" });
    expect(wrapper.attributes("aria-label")).toBe("My Header");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "My Header" });
    expect(wrapper.text()).toBe("My Header");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "My Header" }, { default: "Custom content" });
    expect(wrapper.text()).toBe("Custom content");
  });
});
