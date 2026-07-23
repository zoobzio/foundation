import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Td from "#foundation/components/common/td.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Td, { props, slots });

describe("Td", () => {
  it("renders a td element with f-td class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("TD");
    expect(wrapper.classes()).toContain("f-td");
  });

});
