import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Group from "#foundation/components/common/listbox/group.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Group, { props, slots, global: { stubs: rekaStubs("ListboxGroup") } });

describe("common/listbox/Group", () => {
  it("renders with f-listbox-group class", () => {
    expect(factory().classes()).toContain("f-listbox-group");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the group role", () => {
    expect(factory({ aria: { label: "Actions" } }).attributes("aria-label")).toBe("Actions");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>items</b>" }).find("b").exists()).toBe(true);
  });
});
