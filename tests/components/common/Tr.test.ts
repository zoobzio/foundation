import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Tr from "#foundation/components/common/Tr.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Tr, { props, slots });

describe("Tr", () => {
  it("renders a tr element with f-tr class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("TR");
    expect(wrapper.classes()).toContain("f-tr");
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
});
