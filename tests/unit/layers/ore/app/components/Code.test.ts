import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Code from "../../../../../../layers/ore/app/components/Code.vue";

describe("Code", () => {
  it("renders a code element with f-code class", () => {
    const wrapper = mount(Code);
    expect(wrapper.element.tagName).toBe("CODE");
    expect(wrapper.classes()).toContain("f-code");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Code, {
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
    const wrapper = mount(Code, { slots: { default: "Hello world" } });
    expect(wrapper.text()).toBe("Hello world");
  });
});
