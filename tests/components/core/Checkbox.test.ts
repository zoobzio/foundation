import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountCheckbox } from "#test/support/fixtures/components";

// Core tests stub the tier below: the behavioral element wrapper is replaced
// by name, so assertions target the stub's bound props/attrs.
describe("Checkbox", () => {
  describe("static", () => {
    const wrapper = mountCheckbox();

    it("renders the root part", () => {
      expect(wrapper.findComponent({ name: "CheckboxRoot" }).exists()).toBe(true);
    });

    it("leaves modelValue unbound when absent (no boolean cast)", () => {
      const root = wrapper.findComponent({ name: "CheckboxRoot" });
      expect(root.attributes("modelvalue")).toBeUndefined();
    });

    it("renders a check icon by default", () => {
      expect(wrapper.find("i").attributes("alias")).toBe("check");
    });
  });

  describe("conditional", () => {
    it("passes disabled through the root recipe", () => {
      const wrapper = mountCheckbox({ disabled: true });
      const root = wrapper.findComponent({ name: "CheckboxRoot" });
      expect(root.attributes("disabled")).toBe("true");
    });

    it("renders a minus icon when indeterminate", () => {
      const wrapper = mountCheckbox({ modelValue: "indeterminate" });
      expect(wrapper.find("i").attributes("alias")).toBe("minus");
    });
  });

  describe("models", () => {
    it("binds controlled modelValue down", () => {
      const wrapper = mountCheckbox({ modelValue: true });
      const root = wrapper.findComponent({ name: "CheckboxRoot" });
      expect(root.attributes("modelvalue")).toBe("true");
    });

    it("re-emits child updates and tracks them while uncontrolled", async () => {
      const wrapper = mountCheckbox();
      wrapper
        .findComponent({ name: "CheckboxRoot" })
        .vm.$emit("update:modelValue", true);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "CheckboxRoot" });
      expect(root.attributes("modelvalue")).toBe("true");
    });

    it("stays pinned to the modelValue prop while controlled", async () => {
      const wrapper = mountCheckbox({ modelValue: false });
      wrapper
        .findComponent({ name: "CheckboxRoot" })
        .vm.$emit("update:modelValue", true);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
      const root = wrapper.findComponent({ name: "CheckboxRoot" });
      expect(root.attributes("modelvalue")).toBe("false");
    });
  });

  describe("ctx", () => {
    it("exposes a writable model ref", async () => {
      const wrapper = mountCheckbox();
      wrapper.vm.ctx.modelValue.value = "indeterminate";
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toEqual([["indeterminate"]]);
      expect(wrapper.find("i").attributes("alias")).toBe("minus");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto the root part", () => {
      const wrapper = mountCheckbox({ pt: { root: { class: "custom" } } });
      const root = wrapper.findComponent({ name: "CheckboxRoot" });
      expect(root.classes()).toContain("custom");
    });

    it("user pt wins over the local recipe per key", () => {
      const wrapper = mountCheckbox({ pt: { icon: { alias: "star" } } });
      expect(wrapper.find("i").attributes("alias")).toBe("star");
    });
  });

  describe("slots", () => {
    it("indicator slot overrides default", () => {
      const wrapper = mountCheckbox({}, { indicator: "<b class=\"custom-indicator\"></b>" });
      expect(wrapper.find(".custom-indicator").exists()).toBe(true);
      expect(wrapper.find("i").exists()).toBe(false);
    });

    it("icon slot overrides default", () => {
      const wrapper = mountCheckbox({}, { icon: "<b class=\"custom-icon\"></b>" });
      expect(wrapper.find(".custom-icon").exists()).toBe(true);
    });
  });
});
