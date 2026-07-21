import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import H5 from "#foundation/components/common/H5.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(H5, { props, slots });

describe("H5", () => {
  it("renders an h5 element with f-h5 class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("H5");
    expect(wrapper.classes()).toContain("f-h5");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
