import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Viewport from "#foundation/components/common/toast/viewport.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Viewport, { props, slots, global: { stubs: rekaStubs("ToastViewport") } });

describe("common/toast/Viewport", () => {
  it("renders with f-toast-viewport class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-toast-viewport");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ label: "Notifications" });
    expect(wrapper.attributes("label")).toBe("Notifications");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the region role", () => {
    const wrapper = factory({ aria: { label: "Notifications" } });
    expect(wrapper.attributes("aria-label")).toBe("Notifications");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>toasts</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
