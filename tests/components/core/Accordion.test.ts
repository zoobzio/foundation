import { describe, it, expect } from "vitest";
import { mountAccordion } from "#test/support/fixtures/components";
import { fakeOptionsWithIcons } from "#test/support/data/options";

describe("Accordion", () => {
  describe("static", () => {
    const wrapper = mountAccordion();

    it("renders root with f-accordion-root class", () => {
      expect(wrapper.find(".f-accordion-root").exists()).toBe(true);
    });

    it("renders item for each option", () => {
      expect(wrapper.findAll(".f-accordion-item")).toHaveLength(3);
    });

    it("renders item labels in trigger area", () => {
      const triggers = wrapper.findAll(".f-accordion-trigger");
      expect(triggers[0].text()).toContain("Apple");
      expect(triggers[1].text()).toContain("Banana");
      expect(triggers[2].text()).toContain("Cherry");
    });

    it("defaults type to single and collapsible to true", () => {
      const root = wrapper.find(".f-accordion-root");
      expect(root.attributes("type")).toBe("single");
      expect(root.attributes("collapsible")).toBe("true");
    });
  });

  describe("conditional", () => {
    it("renders Icon when item has icon", () => {
      const wrapper = mountAccordion({ items: fakeOptionsWithIcons });
      const icons = wrapper.findAll("i");
      expect(icons.some((i) => i.attributes("alias") === "home")).toBe(true);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountAccordion({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-accordion-root").classes()).toContain("custom");
    });
  });
});
