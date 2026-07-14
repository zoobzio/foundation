import { describe, it, expect } from "vitest";
import { mountFilterHelp } from "#test/support/fixtures/data";

describe("DataTableFilterHelp", () => {
  describe("static", () => {
    const wrapper = mountFilterHelp();

    it("renders info icon trigger", () => {
      expect(wrapper.find(".f-data-table-filters-info").exists()).toBe(true);
    });

    it("renders a Dialog", () => {
      expect(wrapper.findComponent({ name: "Dialog" }).exists()).toBe(true);
    });

    it("renders a help table with headers", () => {
      expect(wrapper.text()).toContain("Syntax");
      expect(wrapper.text()).toContain("Description");
    });

    it("renders base shortcut rows", () => {
      expect(wrapper.text()).toContain("Semantic search");
      expect(wrapper.text()).toContain("Keyword search (AND)");
      expect(wrapper.text()).toContain("Keyword search (OR)");
    });

    it("renders enum column help rows", () => {
      // fakeColumns has Status as enum
      expect(wrapper.text()).toContain("Filter by Status");
    });

    it("renders date column help rows", () => {
      // fakeColumns has Created as date
      expect(wrapper.text()).toContain("Created after date");
      expect(wrapper.text()).toContain("Created before date");
    });
  });

  describe("passthrough", () => {
    it("pt.trigger merges onto info icon", () => {
      const wrapper = mountFilterHelp({ pt: { trigger: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-data-table-filters-info").classes()).toContain("custom");
    });
  });
});
