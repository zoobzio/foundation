import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Strong from "../../../../../../layers/ore/app/components/Strong.vue";

describe("Strong", () => {
  it("renders a strong element with f-strong class", () => {
    const wrapper = mount(Strong);
    expect(wrapper.element.tagName).toBe("STRONG");
    expect(wrapper.classes()).toContain("f-strong");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Strong, {
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
    const wrapper = mount(Strong, { slots: { default: "Hello world" } });
    expect(wrapper.text()).toBe("Hello world");
  });
});
