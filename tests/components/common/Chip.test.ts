import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Chip from "#foundation/components/common/chip.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Chip, { props, slots });

describe("Chip", () => {
  it("renders button with f-chip class and type='button'", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("BUTTON");
    expect(wrapper.classes()).toContain("f-chip");
    expect(wrapper.attributes("type")).toBe("button");
  });

  it("binds aria-label from the aria channel", () => {
    const wrapper = factory({ aria: { label: "Tag" } });
    expect(wrapper.attributes("aria-label")).toBe("Tag");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "Tag" });
    expect(wrapper.text()).toBe("Tag");
  });

  it("sets disabled attribute", () => {
    const wrapper = factory({ disabled: true });
    expect(wrapper.attributes("disabled")).toBeDefined();
  });

  it("binds aria-pressed from the aria channel", () => {
    const wrapper = factory({ aria: { pressed: true } });
    expect(wrapper.attributes("aria-pressed")).toBe("true");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "Tag" }, { default: "Custom chip" });
    expect(wrapper.text()).toContain("Custom chip");
  });
});
