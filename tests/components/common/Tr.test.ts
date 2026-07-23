import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Tr from "#foundation/components/common/tr.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Tr, { props, slots });

describe("Tr", () => {
  it("renders a tr element with f-tr class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("TR");
    expect(wrapper.classes()).toContain("f-tr");
  });

});
