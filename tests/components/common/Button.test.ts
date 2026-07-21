import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "#foundation/components/common/Button.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Button, { props, slots });

describe("Button", () => {
  it("renders button with f-button class and type='button' by default", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("BUTTON");
    expect(wrapper.classes()).toContain("f-button");
    expect(wrapper.attributes("type")).toBe("button");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = factory({ label: "Submit" });
    expect(wrapper.attributes("aria-label")).toBe("Submit");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "Submit" });
    expect(wrapper.text()).toBe("Submit");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "Submit" }, { default: "Custom content" });
    expect(wrapper.text()).toBe("Custom content");
  });

  it("sets type attribute", () => {
    const wrapper = factory({ type: "submit" });
    expect(wrapper.attributes("type")).toBe("submit");
  });

  it("sets disabled attribute", () => {
    const wrapper = factory({ disabled: true });
    expect(wrapper.attributes("disabled")).toBeDefined();
  });

  it("binds ariaPressed", () => {
    const wrapper = factory({ ariaPressed: true });
    expect(wrapper.attributes("aria-pressed")).toBe("true");
  });

  it("binds ariaExpanded", () => {
    const wrapper = factory({ ariaExpanded: true });
    expect(wrapper.attributes("aria-expanded")).toBe("true");
  });

  it("binds ariaHaspopup", () => {
    const wrapper = factory({ ariaHaspopup: "menu" });
    expect(wrapper.attributes("aria-haspopup")).toBe("menu");
  });
});
