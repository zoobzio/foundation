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

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
