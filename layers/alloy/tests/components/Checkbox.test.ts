import { describe, it, expect } from "vitest";
import { mountCheckbox } from "../fixtures";

describe("Checkbox", () => {
  describe("static", () => {
    const wrapper = mountCheckbox();

    it("renders root with f-checkbox-root class", () => {
      expect(wrapper.find(".f-checkbox-root").exists()).toBe(true);
    });
  });

  describe("conditional", () => {
    it("passes disabled prop to root", () => {
      const wrapper = mountCheckbox({ disabled: true });
      expect(wrapper.find(".f-checkbox-root").attributes("disabled")).toBe("true");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountCheckbox({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-checkbox-root").classes()).toContain("custom");
    });
  });

  describe("interaction", () => {
    it("updates model and icon on CheckboxRoot emit", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountCheckbox();
      wrapper.findComponent({ name: "CheckboxRoot" }).vm.$emit("update:modelValue", true);
      await nextTick();
      expect(wrapper.find("i").attributes("alias")).toBe("check");
    });

    it("shows minus icon when indeterminate", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountCheckbox();
      wrapper.findComponent({ name: "CheckboxRoot" }).vm.$emit("update:modelValue", "indeterminate");
      await nextTick();
      expect(wrapper.find("i").attributes("alias")).toBe("minus");
    });
  });

  describe("slots", () => {
    it("root slot overrides entire component", () => {
      const wrapper = mountCheckbox({}, { root: "<div class=\"custom-root\">Custom</div>" });
      expect(wrapper.find(".custom-root").exists()).toBe(true);
    });

    it("icon slot overrides default icon", () => {
      const wrapper = mountCheckbox({}, { icon: "<span class=\"custom-icon\">X</span>" });
      expect(wrapper.find(".custom-icon").exists()).toBe(true);
    });
  });
});
