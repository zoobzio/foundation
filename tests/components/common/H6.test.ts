import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import H6 from "#foundation/components/common/H6.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(H6, { props, slots });

describe("H6", () => {
  it("renders an h6 element with f-h6 class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("H6");
    expect(wrapper.classes()).toContain("f-h6");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
