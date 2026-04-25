import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Section from "../../../../../../layers/ore/app/components/Section.vue";

describe("Section", () => {
  it("renders a section element with f-section class", () => {
    const wrapper = mount(Section);
    expect(wrapper.element.tagName).toBe("SECTION");
    expect(wrapper.classes()).toContain("f-section");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Section, {
      props: { variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
    });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = mount(Section, { props: { label: "My Section" } });
    expect(wrapper.attributes("aria-label")).toBe("My Section");
  });

  it("renders label as default slot text", () => {
    const wrapper = mount(Section, { props: { label: "My Section" } });
    expect(wrapper.text()).toBe("My Section");
  });

  it("renders custom slot content over label", () => {
    const wrapper = mount(Section, {
      props: { label: "My Section" },
      slots: { default: "Custom content" },
    });
    expect(wrapper.text()).toBe("Custom content");
  });
});
