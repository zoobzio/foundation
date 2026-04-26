import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Caption from "../../app/components/Caption.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Caption, { props, slots, global: { stubs: { Icon: true } } });

describe("Caption", () => {
  it("renders a div element with f-caption class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-caption");
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
    const wrapper = factory({ label: "My Caption" });
    expect(wrapper.attributes("aria-label")).toBe("My Caption");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "My Caption" });
    expect(wrapper.text()).toBe("My Caption");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "My Caption" }, { default: "Custom content" });
    expect(wrapper.text()).toBe("Custom content");
  });

  it("renders Icon when icon prop is provided", () => {
    const wrapper = factory({ icon: "info" });
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
  });

  it("does not render Icon when icon prop is not provided", () => {
    const wrapper = factory();
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(false);
  });
});
