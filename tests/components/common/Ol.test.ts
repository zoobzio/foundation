import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Ol from "#foundation/components/common/ol.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Ol, { props, slots });

describe("Ol", () => {
  it("renders an ol element with f-ol class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("OL");
    expect(wrapper.classes()).toContain("f-ol");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
