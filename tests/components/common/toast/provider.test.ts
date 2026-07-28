import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Provider from "#foundation/components/common/toast/provider.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Provider, { props, slots, global: { stubs: rekaStubs("ToastProvider") } });

describe("common/toast/Provider", () => {
  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ duration: 3000 });
    expect(wrapper.attributes("duration")).toBe("3000");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>app</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
