import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Banner from "../../../../../../layers/ore/app/components/Banner.vue";

describe("Banner", () => {
  it("renders div with f-banner class and role='banner' by default", () => {
    const wrapper = mount(Banner, {
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-banner");
    expect(wrapper.attributes("role")).toBe("banner");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Banner, {
      props: { variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = mount(Banner, {
      props: { label: "Notice" },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.attributes("aria-label")).toBe("Notice");
  });

  it("renders label as default slot text", () => {
    const wrapper = mount(Banner, {
      props: { label: "Notice" },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.text()).toBe("Notice");
  });

  it("sets role attribute", () => {
    const wrapper = mount(Banner, {
      props: { role: "status" },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.attributes("role")).toBe("status");
  });

  it("renders Icon when icon prop is provided", () => {
    const wrapper = mount(Banner, {
      props: { icon: "info" },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
  });

  it("does not render Icon without icon prop", () => {
    const wrapper = mount(Banner, {
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(false);
  });
});
