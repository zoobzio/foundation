import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import P from "../../../../../../layers/ore/app/components/P.vue";

describe("P", () => {
  it("renders a p element with f-p class", () => {
    const wrapper = mount(P);
    expect(wrapper.element.tagName).toBe("P");
    expect(wrapper.classes()).toContain("f-p");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(P, {
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
    const wrapper = mount(P, { slots: { default: "Hello world" } });
    expect(wrapper.text()).toBe("Hello world");
  });
});
