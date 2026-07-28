import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Part from "#foundation/components/common/dropdown-menu/item.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Part, { props, slots, global: { stubs: rekaStubs("DropdownMenuItem") } });

describe("common/dropdown-menu/Item", () => {
  it("renders with f-dropdown-menu-item class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-dropdown-menu-item");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ disabled: true });
    expect(wrapper.attributes("disabled")).toBe("true");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel", () => {
    const wrapper = factory({ aria: { disabled: true } });
    expect(wrapper.attributes("aria-disabled")).toBe("true");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>content</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
