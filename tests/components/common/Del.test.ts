import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Del from "#foundation/components/common/Del.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Del, { props, slots });

describe("Del", () => {
  it("renders a del element with f-del class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("DEL");
    expect(wrapper.classes()).toContain("f-del");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
