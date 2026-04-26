import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Nav from "../../app/components/Nav.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Nav, { props, slots });

describe("Nav", () => {
  it("renders a nav element with f-nav class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("NAV");
    expect(wrapper.classes()).toContain("f-nav");
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
    const wrapper = factory({ label: "My Nav" });
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
