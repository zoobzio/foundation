import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { rekaStubs } from "#test/stubs";
import Root from "#foundation/components/common/dialog/root.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Root, { props, slots, global: { stubs: rekaStubs("DialogRoot") } });

describe("common/dialog/Root", () => {
  it("renders with f-dialog-root class", () => {
    const wrapper = factory();
    expect(wrapper.classes()).toContain("f-dialog-root");
  });

  it("binds open=false by default", () => {
    const wrapper = factory();
    expect(wrapper.attributes("open")).toBe("false");
  });

  it("seeds the fallback from defaultOpen", () => {
    const wrapper = factory({ defaultOpen: true });
    expect(wrapper.attributes("open")).toBe("true");
  });

  it("binds controlled open down", () => {
    const wrapper = factory({ open: true });
    expect(wrapper.attributes("open")).toBe("true");
  });

  it("re-emits update:open and tracks it while uncontrolled", async () => {
    const wrapper = factory();
    wrapper.findComponent({ name: "DialogRoot" }).vm.$emit("update:open", true);
    await nextTick();
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
    expect(wrapper.attributes("open")).toBe("true");
  });

  it("stays pinned to the open prop while controlled", async () => {
    const wrapper = factory({ open: false });
    wrapper.findComponent({ name: "DialogRoot" }).vm.$emit("update:open", true);
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
    const wrapper = factory({}, { default: "<b>body</b>" });
    expect(wrapper.find("b").exists()).toBe(true);
  });
});
