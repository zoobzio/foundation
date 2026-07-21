import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Pre from "#foundation/components/common/Pre.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Pre, { props, slots });

describe("Pre", () => {
  it("renders a pre element with f-pre class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("PRE");
    expect(wrapper.classes()).toContain("f-pre");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
