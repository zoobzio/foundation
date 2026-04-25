import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Alert from "../../../../../../layers/ore/app/components/Alert.vue";

describe("Alert", () => {
  it("renders div with f-alert class and role='alert' by default", () => {
    const wrapper = mount(Alert, {
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-alert");
    expect(wrapper.attributes("role")).toBe("alert");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Alert, {
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
    const wrapper = mount(Alert, {
      props: { label: "Error" },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.attributes("aria-label")).toBe("Error");
  });

  it("renders label as default slot text", () => {
    const wrapper = mount(Alert, {
      props: { label: "Error" },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.text()).toBe("Error");
  });

  it("sets role attribute", () => {
    const wrapper = mount(Alert, {
      props: { role: "status" },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.attributes("role")).toBe("status");
  });

  it("renders Icon when icon prop is provided", () => {
    const wrapper = mount(Alert, {
      props: { icon: "warning" },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
  });

  it("does not render Icon without icon prop", () => {
    const wrapper = mount(Alert, {
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(false);
  });
});
