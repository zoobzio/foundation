import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Kbd from "#foundation/components/common/Kbd.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Kbd, { props, slots });

describe("Kbd", () => {
  it("renders a kbd element with f-kbd class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("KBD");
    expect(wrapper.classes()).toContain("f-kbd");
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

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
