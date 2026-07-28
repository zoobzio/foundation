import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Provider from "#foundation/components/common/tooltip/provider.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Provider, { props, slots, global: { stubs: rekaStubs("TooltipProvider") } });

describe("common/tooltip/Provider", () => {
  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ delayDuration: 500 });
    expect(wrapper.attributes("delayduration")).toBe("500");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>app</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
