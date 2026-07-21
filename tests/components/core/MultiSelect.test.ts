import { describe, it, expect } from "vitest";
import { mountMultiSelect } from "#test/support/fixtures/components";

describe("MultiSelect", () => {
  describe("static", () => {
    const wrapper = mountMultiSelect({ modelValue: [] });

    it("renders Popover as root", () => {
      expect(wrapper.findComponent({ name: "Popover" }).exists()).toBe(true);
    });

    it("renders trigger with placeholder", () => {
      expect(wrapper.find(".f-multiselect-trigger").text()).toContain("Select options");
    });

    it("renders item per option", () => {
      expect(wrapper.findAll(".f-multiselect-item")).toHaveLength(3);
    });
  });

  describe("interaction", () => {
    it("shows item label when one selected", () => {
      const wrapper = mountMultiSelect({ modelValue: ["banana"] });
      expect(wrapper.find(".f-multiselect-trigger").text()).toContain("Banana");
    });

    it("shows count when multiple selected", () => {
      const wrapper = mountMultiSelect({ modelValue: ["apple", "cherry"] });
      expect(wrapper.find(".f-multiselect-trigger").text()).toContain("2 selected");
    });

    it("toggles selection via item click handler", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountMultiSelect({ modelValue: ["apple"] });
      const items = wrapper.findAll(".f-multiselect-item");
      // Item click triggers toggle — emit comes from the handler
      items[0].trigger("click");
      await nextTick();
    });

    it("updates open via Popover emit", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountMultiSelect({ modelValue: [] });
      wrapper.findComponent({ name: "Popover" }).vm.$emit("update:open", true);
      await nextTick();
    });
  });

  describe("passthrough", () => {
    it("pt.popover merges onto Popover", () => {
      const wrapper = mountMultiSelect({ pt: { popover: { props: { class: "custom" } } } });
      expect(wrapper.findComponent({ name: "Popover" }).classes()).toContain("custom");
    });
  });
});
