import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Alert from "../../app/components/Alert.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Alert, { props, slots, global: { stubs: { Icon: true } } });

describe("Alert", () => {
  it("renders div with f-alert class and role='alert' by default", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-alert");
    expect(wrapper.attributes("role")).toBe("alert");
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
    const wrapper = factory({ label: "Error" });
    expect(wrapper.attributes("aria-label")).toBe("Error");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "Error" });
    expect(wrapper.text()).toBe("Error");
  });

  it("sets role attribute", () => {
    const wrapper = factory({ role: "status" });
    expect(wrapper.attributes("role")).toBe("status");
  });

  it("renders Icon when icon prop is provided", () => {
    const wrapper = factory({ icon: "warning" });
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
  });

  it("does not render Icon without icon prop", () => {
    const wrapper = factory();
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(false);
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "Error" }, { default: "Custom alert content" });
    expect(wrapper.text()).toBe("Custom alert content");
  });
});
