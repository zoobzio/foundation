import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Part from "#foundation/components/common/avatar/root.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Part, { props, slots, global: { stubs: rekaStubs("AvatarRoot") } });

describe("common/avatar/Root", () => {
  it("renders with f-avatar-root class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-avatar-root");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ asChild: true });
    expect(wrapper.attributes("aschild")).toBe("true");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel", () => {
    const wrapper = factory({ aria: { label: "User avatar" } });
    expect(wrapper.attributes("aria-label")).toBe("User avatar");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>content</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
