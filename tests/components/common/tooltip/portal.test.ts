import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Portal from "#foundation/components/common/tooltip/portal.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Portal, { props, slots, global: { stubs: rekaStubs("TooltipPortal") } });

describe("common/tooltip/Portal", () => {
  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ disabled: true });
    expect(wrapper.attributes("disabled")).toBe("true");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>content</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
