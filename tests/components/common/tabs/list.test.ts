import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Part from "#foundation/components/common/tabs/list.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Part, { props, slots, global: { stubs: rekaStubs("TabsList") } });

describe("common/tabs/List", () => {
  it("renders with f-tabs-list class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-tabs-list");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ loop: true });
    expect(wrapper.attributes("loop")).toBe("true");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel", () => {
    const wrapper = factory({ aria: { label: "Sections" } });
    expect(wrapper.attributes("aria-label")).toBe("Sections");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>content</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
