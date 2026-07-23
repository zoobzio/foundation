import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Footer from "#foundation/components/common/footer.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Footer, { props, slots });

describe("Footer", () => {
  it("renders a footer element with f-footer class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("FOOTER");
    expect(wrapper.classes()).toContain("f-footer");
  });

  it("binds aria-label from the aria channel", () => {
    const wrapper = factory({ aria: { label: "My Footer" } });
    expect(wrapper.attributes("aria-label")).toBe("My Footer");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "My Footer" });
    expect(wrapper.text()).toBe("My Footer");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "My Footer" }, { default: "Custom content" });
    expect(wrapper.text()).toBe("Custom content");
  });
});
