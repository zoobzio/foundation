import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Th from "#foundation/components/common/th.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Th, { props, slots });

describe("Th", () => {
  it("renders th with f-th class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("TH");
    expect(wrapper.classes()).toContain("f-th");
  });

  it("sets scope attribute", () => {
    const wrapper = factory({ scope: "col" });
    expect(wrapper.attributes("scope")).toBe("col");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Column Header" });
    expect(wrapper.text()).toBe("Column Header");
  });
});
