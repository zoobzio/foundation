import { describe, it, expect } from "vitest";
import { mountListbox } from "#test/support/fixtures/components";

describe("Listbox", () => {
  describe("static", () => {
    const wrapper = mountListbox();

    it("renders root with f-listbox-root class", () => {
      expect(wrapper.find(".f-listbox-root").exists()).toBe(true);
    });

    it("renders item for each option", () => {
      expect(wrapper.findAll(".f-listbox-item")).toHaveLength(3);
    });

    it("renders item labels", () => {
      const items = wrapper.findAll(".f-listbox-item");
      expect(items[0].text()).toContain("Apple");
      expect(items[1].text()).toContain("Banana");
      expect(items[2].text()).toContain("Cherry");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountListbox({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-listbox-root").classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("content slot overrides default", () => {
      const wrapper = mountListbox({}, { content: "<div class=\"custom-content\">Custom</div>" });
      expect(wrapper.find(".custom-content").exists()).toBe(true);
    });
  });
});
