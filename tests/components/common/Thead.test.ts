import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Thead from "#foundation/components/common/thead.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Thead, { props, slots });

describe("Thead", () => {
  it("renders a thead element with f-thead class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("THEAD");
    expect(wrapper.classes()).toContain("f-thead");
  });

});
