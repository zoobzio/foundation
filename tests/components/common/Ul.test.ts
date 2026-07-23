import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Ul from "#foundation/components/common/ul.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Ul, { props, slots });

describe("Ul", () => {
  it("renders a ul element with f-ul class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("UL");
    expect(wrapper.classes()).toContain("f-ul");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
