import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Input from "../../../../../../layers/ore/app/components/Input.vue";

describe("Input", () => {
  it("renders input with f-input class and type='text' by default", () => {
    const wrapper = mount(Input);
    expect(wrapper.element.tagName).toBe("INPUT");
    expect(wrapper.classes()).toContain("f-input");
    expect(wrapper.attributes("type")).toBe("text");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Input, {
      props: { variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
    });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("sets type attribute", () => {
    const wrapper = mount(Input, { props: { type: "email" } });
    expect(wrapper.attributes("type")).toBe("email");
  });

  it("sets aria-label from label prop", () => {
    const wrapper = mount(Input, { props: { label: "Email" } });
    expect(wrapper.attributes("aria-label")).toBe("Email");
  });

  it("sets placeholder attribute", () => {
    const wrapper = mount(Input, { props: { placeholder: "Enter email" } });
    expect(wrapper.attributes("placeholder")).toBe("Enter email");
  });

  it("sets disabled attribute", () => {
    const wrapper = mount(Input, { props: { disabled: true } });
    expect(wrapper.attributes("disabled")).toBeDefined();
  });

  it("sets required attribute", () => {
    const wrapper = mount(Input, { props: { required: true } });
    expect(wrapper.attributes("required")).toBeDefined();
  });

  it("sets name attribute", () => {
    const wrapper = mount(Input, { props: { name: "email" } });
    expect(wrapper.attributes("name")).toBe("email");
  });

  it("sets ariaDescribedby", () => {
    const wrapper = mount(Input, { props: { ariaDescribedby: "help-text" } });
    expect(wrapper.attributes("aria-describedby")).toBe("help-text");
  });

  it("sets ariaInvalid", () => {
    const wrapper = mount(Input, { props: { ariaInvalid: true } });
    expect(wrapper.attributes("aria-invalid")).toBe("true");
  });
});
