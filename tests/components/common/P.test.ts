import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import P from "#foundation/components/common/P.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(P, { props, slots });

describe("P", () => {
  it("renders a p element with f-p class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("P");
    expect(wrapper.classes()).toContain("f-p");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
