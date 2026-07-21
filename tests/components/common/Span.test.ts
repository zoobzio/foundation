import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Span from "#foundation/components/common/Span.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Span, { props, slots });

describe("Span", () => {
  it("renders a span element with f-span class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("SPAN");
    expect(wrapper.classes()).toContain("f-span");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
