import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { rekaStubs } from "#test/stubs";
import Root from "#foundation/components/common/tags-input/root.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Root, { props, slots, global: { stubs: rekaStubs("TagsInputRoot") } });

describe("common/tags-input/Root", () => {
  it("renders with f-tags-input-root class", () => {
    expect(factory().classes()).toContain("f-tags-input-root");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ duplicate: true, addOnTab: true });
    expect(wrapper.attributes("duplicate")).toBe("true");
    expect(wrapper.attributes("addontab")).toBe("true");
  });

  it("binds the controlled model down", () => {
    const wrapper = factory({ modelValue: ["a", "b"] });
    expect(wrapper.attributes("modelvalue")).toBe("a,b");
  });

  it("re-emits update:modelValue in reka vocabulary and tracks it", async () => {
    const wrapper = factory();
    wrapper
      .findComponent({ name: "TagsInputRoot" })
      .vm.$emit("update:modelValue", ["x"]);
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([[["x"]]]);
    expect(wrapper.attributes("modelvalue")).toBe("x");
  });

  it("stays pinned to the modelValue prop while controlled", async () => {
    const wrapper = factory({ modelValue: ["a"] });
    wrapper
      .findComponent({ name: "TagsInputRoot" })
      .vm.$emit("update:modelValue", ["b"]);
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([[["b"]]]);
    expect(wrapper.attributes("modelvalue")).toBe("a");
  });

  it("exposes a writable model ref on ctx", async () => {
    const wrapper = factory();
    wrapper.vm.ctx.modelValue.value = ["cherry"];
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([[["cherry"]]]);
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the group role", () => {
    expect(factory({ aria: { label: "Tags" } }).attributes("aria-label")).toBe("Tags");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>tags</b>" }).find("b").exists()).toBe(true);
  });
});
