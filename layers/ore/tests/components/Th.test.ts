import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Th from "../../app/components/Th.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Th, { props, slots });

describe("Th", () => {
  it("renders th with f-th class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("TH");
    expect(wrapper.classes()).toContain("f-th");
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

  it("sets scope attribute", () => {
    const wrapper = factory({ scope: "col" });
    expect(wrapper.attributes("scope")).toBe("col");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Column Header" });
    expect(wrapper.text()).toBe("Column Header");
  });
});
