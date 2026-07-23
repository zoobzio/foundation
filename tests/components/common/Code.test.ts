import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Code from "#foundation/components/common/code.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Code, { props, slots });

describe("Code", () => {
  it("renders a code element with f-code class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("CODE");
    expect(wrapper.classes()).toContain("f-code");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
