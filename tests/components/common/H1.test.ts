import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import H1 from "#foundation/components/common/h1.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(H1, { props, slots });

describe("H1", () => {
  it("renders an h1 element with f-h1 class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("H1");
    expect(wrapper.classes()).toContain("f-h1");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
