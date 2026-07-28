import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountRadio } from "#test/support/fixtures/components";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs.
describe("Radio", () => {
  describe("static", () => {
    const wrapper = mountRadio();

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "RadioGroupRoot" }).exists()).toBe(true);
    });

    it("leaves modelValue unbound when absent", () => {
      const root = wrapper.findComponent({ name: "RadioGroupRoot" });
      expect(root.attributes("modelvalue")).toBeUndefined();
    });

    it("defaults orientation to vertical", () => {
      const root = wrapper.findComponent({ name: "RadioGroupRoot" });
      expect(root.attributes("orientation")).toBe("vertical");
    });

    it("renders an item per option through the iter recipe", () => {
      const items = wrapper.findAllComponents({ name: "RadioGroupItem" });
      expect(items).toHaveLength(3);
      expect(items.map((i) => i.attributes("value"))).toEqual([
        "apple",
        "banana",
        "cherry",
      ]);
    });

    it("renders a label wrapper and text per option", () => {
      expect(wrapper.findAll("label")).toHaveLength(3);
      const texts = wrapper.findAll("span").map((s) => s.text());
      expect(texts).toEqual(["Apple", "Banana", "Cherry"]);
    });
  });

  describe("conditional", () => {
    it("passes disabled and orientation through the root recipe", () => {
      const wrapper = mountRadio({ disabled: true, orientation: "horizontal" });
      const root = wrapper.findComponent({ name: "RadioGroupRoot" });
      expect(root.attributes("disabled")).toBe("true");
      expect(root.attributes("orientation")).toBe("horizontal");
    });
  });

  describe("models", () => {
    it("binds controlled modelValue down", () => {
      const wrapper = mountRadio({ modelValue: "banana" });
      const root = wrapper.findComponent({ name: "RadioGroupRoot" });
      expect(root.attributes("modelvalue")).toBe("banana");
    });

    it("re-emits child updates coerced to string while uncontrolled", async () => {
      const wrapper = mountRadio();
      wrapper
        .findComponent({ name: "RadioGroupRoot" })
        .vm.$emit("update:modelValue", 42);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["42"]]);
      const root = wrapper.findComponent({ name: "RadioGroupRoot" });
      expect(root.attributes("modelvalue")).toBe("42");
    });

    it("stays pinned to the modelValue prop while controlled", async () => {
      const wrapper = mountRadio({ modelValue: "apple" });
      wrapper
        .findComponent({ name: "RadioGroupRoot" })
        .vm.$emit("update:modelValue", "banana");
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["banana"]]);
      const root = wrapper.findComponent({ name: "RadioGroupRoot" });
      expect(root.attributes("modelvalue")).toBe("apple");
    });
  });

  describe("ctx", () => {
    it("exposes a writable model ref", async () => {
      const wrapper = mountRadio();
      wrapper.vm.ctx.modelValue.value = "cherry";
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["cherry"]]);
      const root = wrapper.findComponent({ name: "RadioGroupRoot" });
      expect(root.attributes("modelvalue")).toBe("cherry");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountRadio({ pt: { root: { class: "custom" } } });
      const root = wrapper.findComponent({ name: "RadioGroupRoot" });
      expect(root.classes()).toContain("custom");
    });

    it("a user iter callback replaces the item recipe wholesale", () => {
      const wrapper = mountRadio({
        pt: { item: () => ({ value: "override" }) },
      });
      const items = wrapper.findAllComponents({ name: "RadioGroupItem" });
      expect(items.map((i) => i.attributes("value"))).toEqual([
        "override",
        "override",
        "override",
      ]);
    });
  });

  describe("slots", () => {
    it("option slot overrides default", () => {
      const wrapper = mountRadio({}, { option: "<div class=\"custom-option\">Custom</div>" });
      expect(wrapper.findAll(".custom-option")).toHaveLength(3);
      expect(wrapper.find("label").exists()).toBe(false);
    });

    it("indicator slot overrides default", () => {
      const wrapper = mountRadio({}, { indicator: "<b class=\"custom-indicator\"></b>" });
      expect(wrapper.findAll(".custom-indicator")).toHaveLength(3);
    });

    it("optionLabel slot overrides default", () => {
      const wrapper = mountRadio({}, { optionLabel: "<b class=\"custom-label\"></b>" });
      expect(wrapper.findAll(".custom-label")).toHaveLength(3);
      expect(wrapper.find("span").exists()).toBe(false);
    });
  });
});
