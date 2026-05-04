import { describe, it, expect } from "vitest";
import { mountSegmentedControl } from "../fixtures";
import { fakeOptionsWithIcons } from "../data/options";

describe("SegmentedControl", () => {
  describe("static", () => {
    const wrapper = mountSegmentedControl();

    it("renders root with f-segmented-control class", () => {
      expect(wrapper.find(".f-segmented-control").exists()).toBe(true);
    });

    it("renders item for each option", () => {
      expect(wrapper.findAll(".f-segmented-control-item")).toHaveLength(3);
    });
  });

  describe("conditional", () => {
    it("renders Icon when option has icon", () => {
      const wrapper = mountSegmentedControl({ options: fakeOptionsWithIcons });
      expect(wrapper.findAll("i").some((i) => i.attributes("alias") === "home")).toBe(true);
    });
  });

  describe("interaction", () => {
    it("updates model on ToggleGroupRoot emit", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountSegmentedControl();
      wrapper.findComponent({ name: "ToggleGroupRoot" }).vm.$emit("update:modelValue", "banana");
      await nextTick();
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["banana"]);
    });

    it("prevents deselection when required", async () => {
      const { nextTick } = await import("vue");
      const wrapper = mountSegmentedControl({ required: true, modelValue: "apple" });
      wrapper.findComponent({ name: "ToggleGroupRoot" }).vm.$emit("update:modelValue", "");
      await nextTick();
      // Should not emit update with empty value
      const emitted = wrapper.emitted("update:modelValue");
      expect(emitted?.some((e) => e[0] === "")).toBeFalsy();
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountSegmentedControl({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-segmented-control").classes()).toContain("custom");
    });
  });
});
