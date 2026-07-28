import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Item from "#foundation/components/common/toggle-group/item.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Item, {
    props: { value: "apple", ...props },
    slots,
    global: { stubs: rekaStubs("ToggleGroupItem") },
  });

describe("common/toggle-group/Item", () => {
  it("renders with f-toggle-group-item class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-toggle-group-item");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ disabled: true });
    expect(wrapper.attributes("value")).toBe("apple");
    expect(wrapper.attributes("disabled")).toBe("true");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the button role", () => {
    const wrapper = factory({ aria: { pressed: true } });
    expect(wrapper.attributes("aria-pressed")).toBe("true");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>label</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
