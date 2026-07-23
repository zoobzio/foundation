import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Hr from "#foundation/components/common/hr.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Hr, { props, slots });

describe("Hr", () => {
  it("renders an hr element with f-hr class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("HR");
    expect(wrapper.classes()).toContain("f-hr");
  });

});
