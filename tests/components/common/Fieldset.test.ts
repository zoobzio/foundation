import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Fieldset from "#foundation/components/common/Fieldset.vue";

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

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<p>Content</p>" });
    expect(wrapper.find("p").text()).toBe("Content");
  });
});
