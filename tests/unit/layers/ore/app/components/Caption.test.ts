import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Caption from "../../../../../../layers/ore/app/components/Caption.vue";

describe("Caption", () => {
  it("renders a div element with f-caption class", () => {
    const wrapper = mount(Caption);
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-caption");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Caption, {
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
    const wrapper = mount(Caption, { props: { label: "My Caption" } });
    expect(wrapper.attributes("aria-label")).toBe("My Caption");
  });

  it("renders label as default slot text", () => {
    const wrapper = mount(Caption, { props: { label: "My Caption" } });
    expect(wrapper.text()).toBe("My Caption");
  });

  it("renders custom slot content over label", () => {
    const wrapper = mount(Caption, {
      props: { label: "My Caption" },
      slots: { default: "Custom content" },
    });
    expect(wrapper.text()).toBe("Custom content");
  });

  it("renders Icon when icon prop is provided", () => {
    const wrapper = mount(Caption, {
      props: { icon: "info" },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
  });

  it("does not render Icon when icon prop is not provided", () => {
    const wrapper = mount(Caption, {
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(false);
  });
});
