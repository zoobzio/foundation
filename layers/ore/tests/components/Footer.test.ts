import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Footer from "../../app/components/Footer.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Footer, { props, slots });

describe("Footer", () => {
  it("renders a footer element with f-footer class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("FOOTER");
    expect(wrapper.classes()).toContain("f-footer");
  });

  it("binds modifier data attributes", () => {
    const wrapper = factory({ variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = factory({ label: "My Footer" });
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
