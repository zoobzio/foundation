import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Tbody from "#foundation/components/common/Tbody.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Tbody, { props, slots });

describe("Tbody", () => {
  it("renders a tbody element with f-tbody class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("TBODY");
    expect(wrapper.classes()).toContain("f-tbody");
  });

});
