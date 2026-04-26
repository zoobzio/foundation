import { describe, it, expect } from "vitest";
import { mountRadio } from "../fixtures";

describe("Radio", () => {
  describe("static", () => {
    const wrapper = mountRadio();

    it("renders root with f-radio-root class", () => {
      expect(wrapper.find(".f-radio-root").exists()).toBe(true);
    });

    it("renders label for each option", () => {
      expect(wrapper.findAll(".f-radio-option")).toHaveLength(3);
    });

    it("renders item for each option", () => {
      expect(wrapper.findAll(".f-radio-item")).toHaveLength(3);
    });

    it("renders option labels in span", () => {
      const labels = wrapper.findAll(".f-radio-label");
      expect(labels[0].text()).toContain("Apple");
      expect(labels[1].text()).toContain("Banana");
      expect(labels[2].text()).toContain("Cherry");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountRadio({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-radio-root").classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("option slot overrides default", () => {
      const wrapper = mountRadio({}, { option: "<div class=\"custom-option\">Custom</div>" });
      expect(wrapper.find(".custom-option").exists()).toBe(true);
    });
  });
});
