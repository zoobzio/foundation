import { describe, it, expect } from "vitest";
import { mountSelect } from "#test/support/fixtures/components";

describe("Select", () => {
  describe("static", () => {
    const wrapper = mountSelect();

    it("renders root with f-select-root class", () => {
      expect(wrapper.find(".f-select-root").exists()).toBe(true);
    });

    it("shows placeholder when no selection", () => {
      expect(wrapper.find("span").text()).toContain("Select an option");
    });

    it("renders item for each option", () => {
      expect(wrapper.findAll(".f-select-item")).toHaveLength(3);
    });
  });

  describe("interaction", () => {
    it("shows selected label when modelValue matches", () => {
      const wrapper = mountSelect({ modelValue: "banana" });
      expect(wrapper.find("span").text()).toContain("Banana");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountSelect({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-select-root").classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("trigger slot overrides default", () => {
      const wrapper = mountSelect({}, { trigger: "<div class=\"custom-trigger\">Pick one</div>" });
      expect(wrapper.find(".custom-trigger").exists()).toBe(true);
    });
  });
});
