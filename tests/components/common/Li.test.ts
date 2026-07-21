import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Li from "#foundation/components/common/Li.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Li, { props, slots });

describe("Li", () => {
  it("renders a li element with f-li class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("LI");
    expect(wrapper.classes()).toContain("f-li");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
