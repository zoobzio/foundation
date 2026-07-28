import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Part from "#foundation/components/common/dropdown-menu/content.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Part, { props, slots, global: { stubs: rekaStubs("DropdownMenuContent") } });

describe("common/dropdown-menu/Content", () => {
  it("renders with f-dropdown-menu-content class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-dropdown-menu-content");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ side: "top", sideOffset: 4 });
    expect(wrapper.attributes("side")).toBe("top");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel", () => {
    const wrapper = factory({ aria: { label: "Actions" } });
    expect(wrapper.attributes("aria-label")).toBe("Actions");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>content</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
