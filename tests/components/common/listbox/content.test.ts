import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Content from "#foundation/components/common/listbox/content.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Content, { props, slots, global: { stubs: rekaStubs("ListboxContent") } });

describe("common/listbox/Content", () => {
  it("renders with f-listbox-content class", () => {
    expect(factory().classes()).toContain("f-listbox-content");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the listbox role", () => {
    const wrapper = factory({ aria: { label: "Fruits" } });
    expect(wrapper.attributes("aria-label")).toBe("Fruits");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>items</b>" }).find("b").exists()).toBe(true);
  });
});
