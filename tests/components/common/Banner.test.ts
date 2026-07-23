import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Banner from "#foundation/components/common/banner.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Banner, { props, slots });

describe("Banner", () => {
  it("renders div with f-banner class and role='banner' by default", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-banner");
    expect(wrapper.attributes("role")).toBe("banner");
  });

  it("binds aria-label from the aria channel", () => {
    const wrapper = factory({ aria: { label: "Notice" } });
    expect(wrapper.attributes("aria-label")).toBe("Notice");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "Notice" });
    expect(wrapper.text()).toBe("Notice");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "Notice" }, { default: "Custom banner content" });
    expect(wrapper.text()).toBe("Custom banner content");
  });
});
