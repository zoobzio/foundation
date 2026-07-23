import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Strong from "#foundation/components/common/strong.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Strong, { props, slots });

describe("Strong", () => {
  it("renders a strong element with f-strong class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("STRONG");
    expect(wrapper.classes()).toContain("f-strong");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
