import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountCommand } from "#test/support/fixtures/components";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs, not wrapper DOM.
describe("Command", () => {
  describe("static", () => {
    const wrapper = mountCommand();

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "ListboxRoot" }).exists()).toBe(true);
    });

    it("renders the filter part", () => {
      expect(wrapper.findComponent({ name: "ListboxFilter" }).exists()).toBe(true);
    });

    it("renders an item per visible option through the iter recipe", () => {
      const items = wrapper.findAllComponents({ name: "ListboxItem" });
      expect(items.map((i) => i.attributes("value"))).toEqual([
        "apple",
        "banana",
        "cherry",
      ]);
    });
  });

  describe("conditional", () => {
    it("renders a Checkbox per item when multiple", () => {
      const wrapper = mountCommand({ multiple: true });
      expect(wrapper.findComponent({ name: "Checkbox" }).exists()).toBe(true);
    });

    it("renders no Checkbox when single-select", () => {
      const wrapper = mountCommand({ multiple: false });
      expect(wrapper.findComponent({ name: "Checkbox" }).exists()).toBe(false);
    });

    it("shows the empty message when no results match", () => {
      const wrapper = mountCommand({ search: "zzzzz" });
      expect(wrapper.findAllComponents({ name: "ListboxItem" })).toHaveLength(0);
      expect(wrapper.text()).toContain("No results found");
    });
  });

  describe("models", () => {
    it("resolves the child key array into selected options (multiple)", async () => {
      const wrapper = mountCommand({ multiple: true });
      wrapper
        .findComponent({ name: "ListboxRoot" })
        .vm.$emit("update:modelValue", ["apple", "cherry"]);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toEqual([
        { value: "apple", label: "Apple", count: 12 },
        { value: "cherry", label: "Cherry", count: 3 },
      ]);
    });

    it("resolves a single key into a one-option array (single-select)", async () => {
      const wrapper = mountCommand({ multiple: false });
      wrapper
        .findComponent({ name: "ListboxRoot" })
        .vm.$emit("update:modelValue", "apple");
      await nextTick();
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
        [{ value: "apple", label: "Apple", count: 12 }],
      ]);
    });

    it("re-emits the search term from the filter part", async () => {
      const wrapper = mountCommand();
      wrapper
        .findComponent({ name: "ListboxFilter" })
        .vm.$emit("update:modelValue", "ban");
      await nextTick();
      expect(wrapper.emitted("update:search")?.[0]).toEqual(["ban"]);
    });

    it("exposes a writable search ref on ctx", async () => {
      const wrapper = mountCommand();
      wrapper.vm.ctx.search.value = "ch";
      await nextTick();
      expect(wrapper.emitted("update:search")?.[0]).toEqual(["ch"]);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountCommand({ pt: { root: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "ListboxRoot" }).classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("item slot overrides the default item subtree", () => {
      const wrapper = mountCommand({}, { item: "<div class=\"custom-item\">X</div>" });
      expect(wrapper.findAll(".custom-item")).toHaveLength(3);
    });
  });
});
