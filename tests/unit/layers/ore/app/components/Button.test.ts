import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "../../../../../../layers/ore/app/components/Button.vue";

describe("Button", () => {
  it("renders button with f-button class and type='button' by default", () => {
    const wrapper = mount(Button);
    expect(wrapper.element.tagName).toBe("BUTTON");
    expect(wrapper.classes()).toContain("f-button");
    expect(wrapper.attributes("type")).toBe("button");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Button, {
      props: { variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
    });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = mount(Button, { props: { label: "Submit" } });
    expect(wrapper.attributes("aria-label")).toBe("Submit");
  });

  it("renders label as default slot text", () => {
    const wrapper = mount(Button, { props: { label: "Submit" } });
    expect(wrapper.text()).toBe("Submit");
  });

  it("renders custom slot content over label", () => {
    const wrapper = mount(Button, {
      props: { label: "Submit" },
      slots: { default: "Custom content" },
    });
    expect(wrapper.text()).toBe("Custom content");
  });

  it("sets type attribute", () => {
    const wrapper = mount(Button, { props: { type: "submit" } });
    expect(wrapper.attributes("type")).toBe("submit");
  });

  it("sets disabled attribute", () => {
    const wrapper = mount(Button, { props: { disabled: true } });
    expect(wrapper.attributes("disabled")).toBeDefined();
  });

  it("binds ariaPressed", () => {
    const wrapper = mount(Button, { props: { ariaPressed: true } });
    expect(wrapper.attributes("aria-pressed")).toBe("true");
  });

  it("binds ariaExpanded", () => {
    const wrapper = mount(Button, { props: { ariaExpanded: true } });
    expect(wrapper.attributes("aria-expanded")).toBe("true");
  });

  it("binds ariaHaspopup", () => {
    const wrapper = mount(Button, { props: { ariaHaspopup: "menu" } });
    expect(wrapper.attributes("aria-haspopup")).toBe("menu");
  });
});
