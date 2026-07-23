import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Alert from "#foundation/components/common/alert.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Alert, { props, slots });

describe("Alert", () => {
  it("renders div with f-alert class and role='alert' by default", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-alert");
    expect(wrapper.attributes("role")).toBe("alert");
  });

  it("binds aria-label from the aria channel", () => {
    const wrapper = factory({ aria: { label: "Error" } });
    expect(wrapper.attributes("aria-label")).toBe("Error");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "Error" });
    expect(wrapper.text()).toBe("Error");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "Error" }, { default: "Custom alert content" });
    expect(wrapper.text()).toBe("Custom alert content");
  });
});
