import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Close from "#foundation/components/common/toast/close.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Close, { props, slots, global: { stubs: rekaStubs("ToastClose") } });

describe("common/toast/Close", () => {
  it("renders with f-toast-close class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-toast-close");
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
    const wrapper = factory({ aria: { label: "Dismiss" } });
    expect(wrapper.attributes("aria-label")).toBe("Dismiss");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>X</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
