import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import H5 from "../../../../../../layers/ore/app/components/H5.vue";

describe("H5", () => {
  it("renders an h5 element with f-h5 class", () => {
    const wrapper = mount(H5);
    expect(wrapper.element.tagName).toBe("H5");
    expect(wrapper.classes()).toContain("f-h5");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(H5, {
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
    const wrapper = mount(H5, { slots: { default: "Hello world" } });
    expect(wrapper.text()).toBe("Hello world");
  });
});
