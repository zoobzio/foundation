import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Blockquote from "#foundation/components/common/Blockquote.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Blockquote, { props, slots });

describe("Blockquote", () => {
  it("renders a blockquote element with f-blockquote class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("BLOCKQUOTE");
    expect(wrapper.classes()).toContain("f-blockquote");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });
});
