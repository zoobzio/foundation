import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Part from "#foundation/components/common/tags-input/item-delete.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Part, { props, slots, global: { stubs: rekaStubs("TagsInputItemDelete") } });

describe("common/tags-input/ItemDelete", () => {
  it("renders with f-tags-input-item-delete class", () => {
    expect(factory().classes()).toContain("f-tags-input-item-delete");
  });

  it("re-emits click from the primitive", async () => {
    const wrapper = factory();
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the button role", () => {
    expect(factory({ aria: { label: "Remove" } }).attributes("aria-label")).toBe("Remove");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>x</b>" }).find("b").exists()).toBe(true);
  });
});
