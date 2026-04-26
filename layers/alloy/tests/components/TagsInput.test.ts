import { describe, it, expect } from "vitest";
import { mountTagsInput } from "../fixtures";

describe("TagsInput", () => {
  describe("static", () => {
    const wrapper = mountTagsInput({ modelValue: ["vue", "react"] });

    it("renders root with f-tags-input-root class", () => {
      expect(wrapper.find(".f-tags-input-root").exists()).toBe(true);
    });

    it("renders item for each tag", () => {
      expect(wrapper.findAll(".f-tags-input-item")).toHaveLength(2);
    });

    it("renders input with f-tags-input-input class", () => {
      expect(wrapper.find(".f-tags-input-input").exists()).toBe(true);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountTagsInput({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-tags-input-root").classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("item slot overrides default", () => {
      const wrapper = mountTagsInput({ modelValue: ["vue"] }, { item: "<div class=\"custom-item\">Custom</div>" });
      expect(wrapper.find(".custom-item").exists()).toBe(true);
    });

    it("input slot overrides default", () => {
      const wrapper = mountTagsInput({}, { input: "<input class=\"custom-input\" />" });
      expect(wrapper.find(".custom-input").exists()).toBe(true);
    });
  });
});
