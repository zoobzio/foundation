import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Fieldset from "../../app/components/Fieldset.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(Fieldset, { props, slots });

describe("Fieldset", () => {
  it("renders fieldset with f-fieldset class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("FIELDSET");
    expect(wrapper.classes()).toContain("f-fieldset");
  });

  it("renders legend when legend prop is provided", () => {
    const wrapper = factory({ legend: "Group Title" });
    const legend = wrapper.find("legend");
    expect(legend.exists()).toBe(true);
    expect(legend.text()).toBe("Group Title");
    expect(legend.classes()).toContain("f-fieldset-legend");
  });

  it("does not render legend when legend prop is absent", () => {
    const wrapper = factory();
    expect(wrapper.find("legend").exists()).toBe(false);
  });

  it("sets disabled attribute", () => {
    const wrapper = factory({ disabled: true });
    expect(wrapper.attributes("disabled")).toBeDefined();
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

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<p>Content</p>" });
    expect(wrapper.find("p").text()).toBe("Content");
  });
});
