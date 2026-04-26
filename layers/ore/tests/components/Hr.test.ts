import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Hr from "../../app/components/Hr.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Hr, { props, slots });

describe("Hr", () => {
  it("renders an hr element with f-hr class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("HR");
    expect(wrapper.classes()).toContain("f-hr");
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
