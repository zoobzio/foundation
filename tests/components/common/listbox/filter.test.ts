import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { rekaStubs } from "#test/stubs";
import Filter from "#foundation/components/common/listbox/filter.vue";

const factory = (props: Record<string, unknown> = {}) =>
  mount(Filter, { props, global: { stubs: rekaStubs("ListboxFilter") } });

describe("common/listbox/Filter", () => {
  it("renders with f-listbox-filter class", () => {
    expect(factory().classes()).toContain("f-listbox-filter");
  });

  it("forwards reka + native props through the rest spread", () => {
    const wrapper = factory({ disabled: true, placeholder: "Search..." });
    expect(wrapper.attributes("disabled")).toBe("true");
    expect(wrapper.attributes("placeholder")).toBe("Search...");
  });

  it("binds a controlled model down", () => {
    expect(factory({ modelValue: "hi" }).attributes("modelvalue")).toBe("hi");
  });

  it("re-emits update:modelValue and tracks it while uncontrolled", async () => {
    const wrapper = factory();
    wrapper
      .findComponent({ name: "ListboxFilter" })
      .vm.$emit("update:modelValue", "abc");
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([["abc"]]);
    expect(wrapper.attributes("modelvalue")).toBe("abc");
  });

  it("renders the aria channel for the textbox role", () => {
    expect(factory({ aria: { label: "Search" } }).attributes("aria-label")).toBe("Search");
  });
});
