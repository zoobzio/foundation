import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { rekaStubs } from "#test/stubs";
import Root from "#foundation/components/common/toast/root.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Root, { props, slots, global: { stubs: rekaStubs("ToastRoot") } });

describe("common/toast/Root", () => {
  it("renders with f-toast-root class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-toast-root");
  });

  it("binds open=true by default", () => {
    const wrapper = factory();
    expect(wrapper.attributes("open")).toBe("true");
  });

  it("seeds the fallback from defaultOpen", () => {
    const wrapper = factory({ defaultOpen: false });
    expect(wrapper.attributes("open")).toBe("false");
  });

  it("binds controlled open down", () => {
    const wrapper = factory({ open: false });
    expect(wrapper.attributes("open")).toBe("false");
  });

  it("re-emits update:open and tracks it while uncontrolled", async () => {
    const wrapper = factory();
    wrapper.findComponent({ name: "ToastRoot" }).vm.$emit("update:open", false);
    await nextTick();
    expect(wrapper.emitted("update:open")).toEqual([[false]]);
    expect(wrapper.attributes("open")).toBe("false");
  });

  it("stays pinned to the open prop while controlled", async () => {
    const wrapper = factory({ open: true });
    wrapper.findComponent({ name: "ToastRoot" }).vm.$emit("update:open", false);
    await nextTick();
    expect(wrapper.emitted("update:open")).toEqual([[false]]);
    expect(wrapper.attributes("open")).toBe("true");
  });

  it("exposes a writable open ref on ctx", async () => {
    const wrapper = factory();
    wrapper.vm.ctx.open.value = false;
    await nextTick();
    expect(wrapper.emitted("update:open")).toEqual([[false]]);
    expect(wrapper.attributes("open")).toBe("false");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ duration: 3000 });
    expect(wrapper.attributes("duration")).toBe("3000");
  });

  it("renders the modifiers channel as data attributes", () => {
    const wrapper = factory({ modifiers: { variant: "error" } });
    expect(wrapper.attributes("data-variant")).toBe("error");
  });

  it("renders the aria channel for the status role", () => {
    const wrapper = factory({ aria: { label: "Notification" } });
    expect(wrapper.attributes("aria-label")).toBe("Notification");
  });

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "<b>body</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
