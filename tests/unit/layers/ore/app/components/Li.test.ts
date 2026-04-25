import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Li from "../../../../../../layers/ore/app/components/Li.vue";

describe("Li", () => {
  it("renders a li element with f-li class", () => {
    const wrapper = mount(Li);
    expect(wrapper.element.tagName).toBe("LI");
    expect(wrapper.classes()).toContain("f-li");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Li, {
      props: { variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
    });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("renders default slot content", () => {
    const wrapper = mount(Li, { slots: { default: "Hello world" } });
    expect(wrapper.text()).toBe("Hello world");
  });
});
