import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Input from "#foundation/components/common/Input.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Input, { props, slots });

describe("Input", () => {
  it("renders input with f-input class and type='text' by default", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("INPUT");
    expect(wrapper.classes()).toContain("f-input");
    expect(wrapper.attributes("type")).toBe("text");
  });

  it("sets type attribute", () => {
    const wrapper = factory({ type: "email" });
    expect(wrapper.attributes("type")).toBe("email");
  });

  it("sets aria-label from label prop", () => {
    const wrapper = factory({ label: "Email" });
    expect(wrapper.attributes("aria-label")).toBe("Email");
  });

  it("sets placeholder attribute", () => {
    const wrapper = factory({ placeholder: "Enter email" });
    expect(wrapper.attributes("placeholder")).toBe("Enter email");
  });

  it("sets disabled attribute", () => {
    const wrapper = factory({ disabled: true });
    expect(wrapper.attributes("disabled")).toBeDefined();
  });

  it("sets required attribute", () => {
    const wrapper = factory({ required: true });
    expect(wrapper.attributes("required")).toBeDefined();
  });

  it("sets name attribute", () => {
    const wrapper = factory({ name: "email" });
    expect(wrapper.attributes("name")).toBe("email");
  });

  it("sets ariaDescribedby", () => {
    const wrapper = factory({ ariaDescribedby: "help-text" });
    expect(wrapper.attributes("aria-describedby")).toBe("help-text");
  });

  it("sets ariaInvalid", () => {
    const wrapper = factory({ ariaInvalid: true });
    expect(wrapper.attributes("aria-invalid")).toBe("true");
  });
});
