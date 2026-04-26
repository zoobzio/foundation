import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Chip from "../../app/components/Chip.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Chip, { props, slots, global: { stubs: { Icon: true } } });

describe("Chip", () => {
  it("renders button with f-chip class and type='button'", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("BUTTON");
    expect(wrapper.classes()).toContain("f-chip");
    expect(wrapper.attributes("type")).toBe("button");
  });

  it("binds modifier data attributes", () => {
    const wrapper = factory({ variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = factory({ label: "Tag" });
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

  it("binds ariaPressed", () => {
    const wrapper = factory({ ariaPressed: true });
    expect(wrapper.attributes("aria-pressed")).toBe("true");
  });

  it("binds ariaSelected", () => {
    const wrapper = factory({ ariaSelected: true });
    expect(wrapper.attributes("aria-selected")).toBe("true");
  });

  it("renders close Icon when closable is true", () => {
    const wrapper = factory({ closable: true });
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
  });

  it("does not render close Icon when closable is false", () => {
    const wrapper = factory();
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(false);
  });

  it("sets data-closable attribute when closable is true", () => {
    const wrapper = factory({ closable: true });
    expect(wrapper.attributes("data-closable")).toBe("true");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "Tag" }, { default: "Custom chip" });
    expect(wrapper.text()).toContain("Custom chip");
  });
});
