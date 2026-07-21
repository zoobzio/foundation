import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import H4 from "#foundation/components/common/H4.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(H4, { props, slots });

describe("H4", () => {
  it("renders an h4 element with f-h4 class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("H4");
    expect(wrapper.classes()).toContain("f-h4");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
