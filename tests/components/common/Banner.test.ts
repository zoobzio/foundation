import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Banner from "#foundation/components/common/Banner.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Banner, { props, slots, global: { stubs: { Icon: true } } });

describe("Banner", () => {
  it("renders div with f-banner class and role='banner' by default", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-banner");
    expect(wrapper.attributes("role")).toBe("banner");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = factory({ label: "Notice" });
    expect(wrapper.attributes("aria-label")).toBe("Notice");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "Notice" });
    expect(wrapper.text()).toBe("Notice");
  });

  it("sets role attribute", () => {
    const wrapper = factory({ role: "status" });
    expect(wrapper.attributes("role")).toBe("status");
  });

  it("renders Icon when icon prop is provided", () => {
    const wrapper = factory({ icon: "info" });
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
  });

  it("does not render Icon without icon prop", () => {
    const wrapper = factory();
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(false);
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "Notice" }, { default: "Custom banner content" });
    expect(wrapper.text()).toBe("Custom banner content");
  });
});
