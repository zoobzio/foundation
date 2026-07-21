import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Aside from "#foundation/components/common/Aside.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Aside, { props, slots });

describe("Aside", () => {
  it("renders an aside element with f-aside class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("ASIDE");
    expect(wrapper.classes()).toContain("f-aside");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = factory({ label: "My Aside" });
    expect(wrapper.attributes("aria-label")).toBe("My Aside");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "My Aside" });
    expect(wrapper.text()).toBe("My Aside");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "My Aside" }, { default: "Custom content" });
    expect(wrapper.text()).toBe("Custom content");
  });
});
