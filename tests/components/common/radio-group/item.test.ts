import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Item from "#foundation/components/common/radio-group/item.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Item, {
    props: { value: "apple", ...props },
    slots,
    global: { stubs: rekaStubs("RadioGroupItem") },
  });

describe("common/radio-group/Item", () => {
  it("renders with f-radio-group-item class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-radio-group-item");
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

  it("renders the aria channel for the radio role", () => {
    const wrapper = factory({ aria: { checked: true } });
    expect(wrapper.attributes("aria-checked")).toBe("true");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>indicator</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
