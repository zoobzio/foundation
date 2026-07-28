import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountSegmentedControl } from "#test/support/fixtures/components";
import { fakeOptionsWithIcons } from "#test/support/data/options";

// Core tests stub the tier below: the behavioral element wrappers are replaced
// by name, so assertions target the stubs' bound props/attrs.
describe("SegmentedControl", () => {
  describe("static", () => {
    const wrapper = mountSegmentedControl();

    it("renders the root part in single mode", () => {
      const root = wrapper.findComponent({ name: "ToggleGroupRoot" });
      expect(root.exists()).toBe(true);
      expect(root.attributes("type")).toBe("single");
    });

    it("leaves modelValue unbound when absent", () => {
      const root = wrapper.findComponent({ name: "ToggleGroupRoot" });
      expect(root.attributes("modelvalue")).toBeUndefined();
    });

    it("renders an item per option through the iter recipe", () => {
      const items = wrapper.findAllComponents({ name: "ToggleGroupItem" });
      expect(items).toHaveLength(3);
      expect(items.map((i) => i.attributes("value"))).toEqual([
        "apple",
        "banana",
        "cherry",
      ]);
    });
  });

  describe("conditional", () => {
    it("renders an icon through the iter recipe when the option has one", () => {
      const wrapper = mountSegmentedControl({ options: fakeOptionsWithIcons });
      expect(wrapper.findAll("i").some((i) => i.attributes("alias") === "home")).toBe(true);
    });

    it("passes disabled through the root recipe", () => {
      const wrapper = mountSegmentedControl({ disabled: true });
      const root = wrapper.findComponent({ name: "ToggleGroupRoot" });
      expect(root.attributes("disabled")).toBe("true");
    });
  });

  describe("models", () => {
    it("binds controlled modelValue down", () => {
      const wrapper = mountSegmentedControl({ modelValue: "banana" });
      const root = wrapper.findComponent({ name: "ToggleGroupRoot" });
      expect(root.attributes("modelvalue")).toBe("banana");
    });

    it("re-emits child updates while uncontrolled", async () => {
      const wrapper = mountSegmentedControl();
      wrapper
        .findComponent({ name: "ToggleGroupRoot" })
        .vm.$emit("update:modelValue", "banana");
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["banana"]]);
    });

    it("takes the first entry when the child emits an array", async () => {
      const wrapper = mountSegmentedControl();
      wrapper
        .findComponent({ name: "ToggleGroupRoot" })
        .vm.$emit("update:modelValue", ["banana", "cherry"]);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["banana"]]);
    });

    it("prevents deselection when required", async () => {
      const wrapper = mountSegmentedControl({ required: true, modelValue: "apple" });
      wrapper
        .findComponent({ name: "ToggleGroupRoot" })
        .vm.$emit("update:modelValue", "");
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });

    it("allows deselection when not required", async () => {
      const wrapper = mountSegmentedControl({ modelValue: "apple" });
      wrapper
        .findComponent({ name: "ToggleGroupRoot" })
        .vm.$emit("update:modelValue", "");
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[""]]);
    });
  });

  describe("ctx", () => {
    it("exposes a writable model ref", async () => {
      const wrapper = mountSegmentedControl();
      wrapper.vm.ctx.modelValue.value = "cherry";
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["cherry"]]);
      const root = wrapper.findComponent({ name: "ToggleGroupRoot" });
      expect(root.attributes("modelvalue")).toBe("cherry");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountSegmentedControl({ pt: { root: { class: "custom" } } });
      const root = wrapper.findComponent({ name: "ToggleGroupRoot" });
      expect(root.classes()).toContain("custom");
      expect(root.attributes("type")).toBe("single");
    });

    it("a user iter callback replaces the item recipe wholesale", () => {
      const wrapper = mountSegmentedControl({
        pt: { item: () => ({ value: "override" }) },
      });
      const items = wrapper.findAllComponents({ name: "ToggleGroupItem" });
      expect(items.map((i) => i.attributes("value"))).toEqual([
        "override",
        "override",
        "override",
      ]);
    });
  });

  describe("slots", () => {
    it("item slot overrides default", () => {
      const wrapper = mountSegmentedControl({}, { item: "<div class=\"custom-item\"></div>" });
      expect(wrapper.findAll(".custom-item")).toHaveLength(3);
      expect(wrapper.findComponent({ name: "ToggleGroupItem" }).exists()).toBe(false);
    });

    it("itemLabel slot overrides default", () => {
      const wrapper = mountSegmentedControl({}, { itemLabel: "<b class=\"custom-label\"></b>" });
      expect(wrapper.findAll(".custom-label")).toHaveLength(3);
      expect(wrapper.find("span").exists()).toBe(false);
    });
  });
});
