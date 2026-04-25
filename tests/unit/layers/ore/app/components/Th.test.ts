import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Th from "../../../../../../layers/ore/app/components/Th.vue";

describe("Th", () => {
  it("renders th with f-th class", () => {
    const wrapper = mount(Th);
    expect(wrapper.element.tagName).toBe("TH");
    expect(wrapper.classes()).toContain("f-th");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Th, {
      props: { variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
    });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("sets scope attribute", () => {
    const wrapper = mount(Th, { props: { scope: "col" } });
    expect(wrapper.attributes("scope")).toBe("col");
  });

  it("renders default slot content", () => {
    const wrapper = mount(Th, {
      slots: { default: "Column Header" },
    });
    expect(wrapper.text()).toBe("Column Header");
  });
});
