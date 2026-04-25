import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Container from "../../../../../../layers/ore/app/components/Container.vue";

describe("Container", () => {
  it("renders a div element with f-container class", () => {
    const wrapper = mount(Container);
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-container");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Container, {
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
    const wrapper = mount(Container, { props: { label: "My Container" } });
    expect(wrapper.attributes("aria-label")).toBe("My Container");
  });

  it("renders label as default slot text", () => {
    const wrapper = mount(Container, { props: { label: "My Container" } });
    expect(wrapper.text()).toBe("My Container");
  });

  it("renders custom slot content over label", () => {
    const wrapper = mount(Container, {
      props: { label: "My Container" },
      slots: { default: "Custom content" },
    });
    expect(wrapper.text()).toBe("Custom content");
  });
});
