import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Textarea from "#foundation/components/common/Textarea.vue";

const factory = (props: Record<string, unknown> = {}) =>
  mount(Textarea, { props });

describe("Textarea", () => {
  it("renders textarea with f-textarea class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("TEXTAREA");
    expect(wrapper.classes()).toContain("f-textarea");
  });

  it("sets aria-label from label prop", () => {
    const wrapper = factory({ label: "Bio" });
    expect(wrapper.attributes("aria-label")).toBe("Bio");
  });

  it("sets placeholder attribute", () => {
    const wrapper = factory({ placeholder: "Enter text" });
    expect(wrapper.attributes("placeholder")).toBe("Enter text");
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
    const wrapper = factory({ name: "bio" });
    expect(wrapper.attributes("name")).toBe("bio");
  });

  it("sets rows attribute", () => {
    const wrapper = factory({ rows: 5 });
    expect(wrapper.attributes("rows")).toBe("5");
  });

  it("sets ariaDescribedby", () => {
    const wrapper = factory({ ariaDescribedby: "help" });
    expect(wrapper.attributes("aria-describedby")).toBe("help");
  });

  it("sets ariaInvalid", () => {
    const wrapper = factory({ ariaInvalid: true });
    expect(wrapper.attributes("aria-invalid")).toBe("true");
  });
});
