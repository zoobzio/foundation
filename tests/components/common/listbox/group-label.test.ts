import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import GroupLabel from "#foundation/components/common/listbox/group-label.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(GroupLabel, { props, slots, global: { stubs: rekaStubs("ListboxGroupLabel") } });

describe("common/listbox/GroupLabel", () => {
  it("renders with f-listbox-group-label class", () => {
    expect(factory().classes()).toContain("f-listbox-group-label");
  });

  it("forwards reka props through the rest spread", () => {
    expect(factory({ for: "grp-1" }).attributes("for")).toBe("grp-1");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>Group</b>" }).find("b").exists()).toBe(true);
  });
});
