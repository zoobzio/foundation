import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Span from "../../../../../../layers/ore/app/components/Span.vue";

describe("Span", () => {
  it("renders a span element with f-span class", () => {
    const wrapper = mount(Span);
    expect(wrapper.element.tagName).toBe("SPAN");
    expect(wrapper.classes()).toContain("f-span");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Span, {
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
    const wrapper = mount(Span, { slots: { default: "Hello world" } });
    expect(wrapper.text()).toBe("Hello world");
  });
});
