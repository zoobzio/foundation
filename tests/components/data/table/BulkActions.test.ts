import { describe, it, expect } from "vitest";
import { mountBulkActions } from "#test/support/fixtures/data";

describe("DataTableBulkActions", () => {
  describe("static", () => {
    const wrapper = mountBulkActions();

    it("renders root with f-data-table-bulk-actions class", () => {
      expect(wrapper.find(".f-data-table-bulk-actions").exists()).toBe(true);
    });

    it("renders selection count", () => {
      expect(wrapper.find(".f-data-table-bulk-actions-count").text()).toContain("2 selected");
    });

    it("renders bulk action buttons", () => {
      const actions = wrapper.findAll(".f-data-table-bulk-action");
      expect(actions).toHaveLength(1);
      expect(actions[0].text()).toContain("Delete Selected");
    });

    it("renders clear button", () => {
      expect(wrapper.find(".f-data-table-bulk-action-clear").exists()).toBe(true);
      expect(wrapper.find(".f-data-table-bulk-action-clear").text()).toContain("Clear");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountBulkActions({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-data-table-bulk-actions").classes()).toContain("custom");
    });
  });
});
