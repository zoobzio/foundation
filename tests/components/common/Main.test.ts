import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Main from "#foundation/components/common/main.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Main, { props, slots });

describe("Main", () => {
  it("renders a main element with f-main class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("MAIN");
    expect(wrapper.classes()).toContain("f-main");
  });

  it("binds aria-label from the aria channel", () => {
    const wrapper = factory({ aria: { label: "My Main" } });
    expect(wrapper.attributes("aria-label")).toBe("My Main");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "My Main" });
    expect(wrapper.text()).toBe("My Main");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "My Main" }, { default: "Custom content" });
    expect(wrapper.text()).toBe("Custom content");
  });
});
