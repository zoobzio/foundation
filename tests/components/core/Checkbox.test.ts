import { describe, it, expect } from "vitest";
import { mountCheckbox } from "#test/support/fixtures/components";

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
    it("emits update:modelValue on CheckboxRoot emit", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountCheckbox();
      wrapper.findComponent({ name: "CheckboxRoot" }).vm.$emit("update:modelValue", true);
      await nextTick();
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true]);
    });

    it("shows check icon when modelValue is true", () => {
      const wrapper = mountCheckbox({ modelValue: true });
      expect(wrapper.find("i").attributes("alias")).toBe("check");
    });

    it("shows minus icon when modelValue is indeterminate", () => {
      const wrapper = mountCheckbox({ modelValue: "indeterminate" });
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
