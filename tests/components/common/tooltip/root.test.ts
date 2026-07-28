import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { rekaStubs } from "#test/stubs";
import Root from "#foundation/components/common/tooltip/root.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Root, { props, slots, global: { stubs: rekaStubs("TooltipRoot") } });

describe("common/tooltip/Root", () => {
  it("renders with f-tooltip-root class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-tooltip-root");
  });

  it("binds open=false by default (useModel fallback)", () => {
    const wrapper = factory();
    expect(wrapper.attributes("open")).toBe("false");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ delayDuration: 300 });
    expect(wrapper.attributes("delayduration")).toBe("300");
  });

  it("binds controlled open down", () => {
    const wrapper = factory({ open: true });
    expect(wrapper.attributes("open")).toBe("true");
  });

  it("re-emits update:open and tracks it while uncontrolled", async () => {
    const wrapper = factory();
    wrapper.findComponent({ name: "TooltipRoot" }).vm.$emit("update:open", true);
    await nextTick();
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
    expect(wrapper.attributes("open")).toBe("true");
  });

  it("stays pinned to the open prop while controlled", async () => {
    const wrapper = factory({ open: false });
    wrapper.findComponent({ name: "TooltipRoot" }).vm.$emit("update:open", true);
    await nextTick();
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
    expect(wrapper.attributes("open")).toBe("false");
  });

  it("exposes a writable open ref on ctx", async () => {
    const wrapper = factory();
    wrapper.vm.ctx.open.value = true;
    await nextTick();
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
    expect(wrapper.attributes("open")).toBe("true");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>anchor</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
