import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Em from "#foundation/components/common/Em.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Em, { props, slots });

describe("Em", () => {
  it("renders an em element with f-em class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("EM");
    expect(wrapper.classes()).toContain("f-em");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
