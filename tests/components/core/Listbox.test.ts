import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountListbox } from "#test/support/fixtures/components";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs, not wrapper DOM.
describe("Listbox", () => {
  describe("static", () => {
    const wrapper = mountListbox();

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "ListboxRoot" }).exists()).toBe(true);
    });

    it("renders the content part", () => {
      expect(wrapper.findComponent({ name: "ListboxContent" }).exists()).toBe(true);
    });

    it("renders an item per option through the iter recipe", () => {
      const items = wrapper.findAllComponents({ name: "ListboxItem" });
      expect(items).toHaveLength(3);
      expect(items.map((i) => i.attributes("value"))).toEqual([
        "apple",
        "banana",
        "cherry",
      ]);
    });

    it("renders item labels", () => {
      const items = wrapper.findAllComponents({ name: "ListboxItem" });
      expect(items[0].text()).toContain("Apple");
      expect(items[1].text()).toContain("Banana");
      expect(items[2].text()).toContain("Cherry");
    });
  });

  describe("models", () => {
    it("re-emits child selection coerced to string (uncontrolled)", async () => {
      const wrapper = mountListbox();
      wrapper
        .findComponent({ name: "ListboxRoot" })
        .vm.$emit("update:modelValue", "banana");
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["banana"]]);
    });

    it("coerces an array payload element-wise when multiple", async () => {
      const wrapper = mountListbox({ multiple: true });
      wrapper
        .findComponent({ name: "ListboxRoot" })
        .vm.$emit("update:modelValue", ["apple", "cherry"]);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[["apple", "cherry"]]]);
    });

    it("exposes a writable model ref on ctx", async () => {
      const wrapper = mountListbox();
      wrapper.vm.ctx.modelValue.value = "cherry";
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["cherry"]]);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountListbox({ pt: { root: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "ListboxRoot" }).classes()).toContain("custom");
    });

    it("a user item callback replaces the recipe and owns per-item wiring", () => {
      const wrapper = mountListbox({
        pt: { item: (option) => ({ value: option.value, disabled: true }) },
      });
      const items = wrapper.findAllComponents({ name: "ListboxItem" });
      expect(items.map((i) => i.attributes("value"))).toEqual([
        "apple",
        "banana",
        "cherry",
      ]);
      expect(items.every((i) => i.attributes("disabled") === "true")).toBe(true);
    });
  });

  describe("slots", () => {
    it("content slot overrides the default subtree", () => {
      const wrapper = mountListbox({}, { content: "<div class=\"custom-content\">Custom</div>" });
      expect(wrapper.find(".custom-content").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "ListboxContent" }).exists()).toBe(false);
    });

    it("item slot overrides the default item", () => {
      const wrapper = mountListbox({}, { item: "<div class=\"custom-item\">X</div>" });
      expect(wrapper.findAll(".custom-item")).toHaveLength(3);
    });
  });
});
