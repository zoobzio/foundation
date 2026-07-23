import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import H3 from "#foundation/components/common/h3.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(H3, { props, slots });

describe("H3", () => {
  it("renders an h3 element with f-h3 class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("H3");
    expect(wrapper.classes()).toContain("f-h3");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
