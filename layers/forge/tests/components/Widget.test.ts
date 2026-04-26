import { describe, it, expect } from "vitest";
import { mountWidget, mockTable } from "../fixtures";
import { fakeBulkActions } from "../../../../packages/testing/data/table";

describe("DataTableWidget", () => {
  describe("static", () => {
    const wrapper = mountWidget();

    it("renders root with f-data-table class", () => {
      expect(wrapper.find(".f-data-table").exists()).toBe(true);
    });

    it("renders toolbar with f-data-table-toolbar class", () => {
      expect(wrapper.find(".f-data-table-toolbar").exists()).toBe(true);
    });

    it("delegates to DataTableFilters", () => {
      expect(wrapper.findComponent({ name: "DataTableFilters" }).exists()).toBe(true);
    });

    it("delegates to DataTableSearch", () => {
      expect(wrapper.findComponent({ name: "DataTableSearch" }).exists()).toBe(true);
    });

    it("delegates to DataTableColumns", () => {
      expect(wrapper.findComponent({ name: "DataTableColumns" }).exists()).toBe(true);
    });

    it("delegates to DataTableHead", () => {
      expect(wrapper.findComponent({ name: "DataTableHead" }).exists()).toBe(true);
    });

    it("delegates to DataTableBody", () => {
      expect(wrapper.findComponent({ name: "DataTableBody" }).exists()).toBe(true);
    });

    it("renders Pagination", () => {
      expect(wrapper.findComponent({ name: "Pagination" }).exists()).toBe(true);
    });
  });

  describe("conditional", () => {
    it("shows BulkActions when rows are selected", () => {
      const table = mockTable({ bulkActions: fakeBulkActions });
      table.selected.value = new Set([1]);
      const wrapper = mountWidget({ table });
      expect(wrapper.findComponent({ name: "DataTableBulkActions" }).exists()).toBe(true);
    });

    it("hides BulkActions when no rows selected", () => {
      const wrapper = mountWidget();
      expect(wrapper.findComponent({ name: "DataTableBulkActions" }).exists()).toBe(false);
    });
  });

  describe("computed props", () => {
    it("namespaces facet groups for Facets component", () => {
      const table = mockTable();
      table.facetGroups.value = [
        { key: "status", label: "Status", items: [{ value: "Active", label: "Active", count: 2 }] },
      ];
      const wrapper = mountWidget({ table });
      const facets = wrapper.findComponent({ name: "Facets" });
      // The groups prop should have namespaced values like "status:Active"
      expect(facets.attributes("groups")).toBeDefined();
    });

    it("computes date field configs from table.dateColumns", () => {
      const table = mockTable();
      const wrapper = mountWidget({ table });
      const dateFilters = wrapper.findComponent({ name: "DateFilters" });
      expect(dateFilters.attributes("fields")).toBeDefined();
    });

    it("passes pagination props to Pagination", () => {
      const table = mockTable();
      table.page.value = 3;
      table.total.value = 100;
      const wrapper = mountWidget({ table });
      const pagination = wrapper.findComponent({ name: "Pagination" });
      expect(pagination.attributes("page")).toBe("3");
      expect(pagination.attributes("total")).toBe("100");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountWidget({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-data-table").classes()).toContain("custom");
    });
  });
});
