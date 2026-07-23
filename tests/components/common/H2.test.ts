import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import H2 from "#foundation/components/common/h2.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(H2, { props, slots });

describe("H2", () => {
  it("renders an h2 element with f-h2 class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("H2");
    expect(wrapper.classes()).toContain("f-h2");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
