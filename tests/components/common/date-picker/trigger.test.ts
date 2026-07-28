import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Trigger from "#foundation/components/common/date-picker/trigger.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Trigger, { props, slots, global: { stubs: rekaStubs("DatePickerTrigger") } });

describe("common/date-picker/Trigger", () => {
  it("renders with f-date-picker-trigger class", () => {
    expect(factory().classes()).toContain("f-date-picker-trigger");
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
    expect(factory({ aria: { label: "Open calendar" } }).attributes("aria-label")).toBe("Open calendar");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>cal</b>" }).find("b").exists()).toBe(true);
  });
});
