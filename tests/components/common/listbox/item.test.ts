import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Item from "#foundation/components/common/listbox/item.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Item, {
    props: { value: "apple", ...props },
    slots,
    global: { stubs: rekaStubs("ListboxItem") },
  });

describe("common/listbox/Item", () => {
  it("renders with f-listbox-item class", () => {
    expect(factory().classes()).toContain("f-listbox-item");
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

  it("renders the aria channel for the option role", () => {
    const wrapper = factory({ aria: { selected: true } });
    expect(wrapper.attributes("aria-selected")).toBe("true");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>Apple</b>" }).find("b").exists()).toBe(true);
  });
});
