import { describe, it, expect } from "vitest";
import { mountWidget, mockTable } from "../fixtures";
import { fakeBulkActions } from "../data/table";

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

    it("delegates to DataTableColumns", () => {
      expect(wrapper.findComponent({ name: "DataTableColumns" }).exists()).toBe(true);
    });

    it("renders refresh Fab", () => {
      const fab = wrapper.findComponent({ name: "Fab" });
      expect(fab.exists()).toBe(true);
      expect(fab.attributes("icon")).toBe("refresh");
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

  describe("interaction", () => {
    it("calls table.fetch when refresh Fab is clicked", async () => {
      const table = mockTable();
      const wrapper = mountWidget({ table });
      const fab = wrapper.findComponent({ name: "Fab" });
      await fab.trigger("click");
      expect(table.fetch).toHaveBeenCalled();
    });
  });

  describe("slot forwarding", () => {
    it("renders default Pagination when no pagination slot override", () => {
      const wrapper = mountWidget();
      expect(wrapper.findComponent({ name: "Pagination" }).exists()).toBe(true);
    });

    it("renders Scroller wrapping Table + Head + Body", () => {
      const wrapper = mountWidget();
      expect(wrapper.findComponent({ name: "Scroller" }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: "Table" }).exists()).toBe(true);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountWidget({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-data-table").classes()).toContain("custom");
    });
  });
});
