import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountHead, mockTable } from "../fixtures";
import { fakeActions, fakeBulkActions } from "../data/table";
import type { FakeRow } from "../data/table";
import type { DataTableColumn } from "../../app/types/data-table";

describe("DataTableHead", () => {
  describe("static", () => {
    const wrapper = mountHead();

    it("renders thead element", () => {
      expect(wrapper.find("thead").exists()).toBe(true);
    });

    it("renders a Th for each visible column", () => {
      const ths = wrapper.findAll("th");
      expect(ths).toHaveLength(5);
    });

    it("renders column labels", () => {
      expect(wrapper.text()).toContain("Name");
      expect(wrapper.text()).toContain("Status");
      expect(wrapper.text()).toContain("Created");
    });

    it("renders drag handle icons", () => {
      const icons = wrapper.findAll(".f-data-table-drag-handle");
      expect(icons).toHaveLength(5);
    });
  });

  describe("conditional", () => {
    it("renders select-all checkbox when bulkActions present", () => {
      const table = mockTable({ bulkActions: fakeBulkActions });
      const wrapper = mountHead({ table });
      expect(wrapper.find(".f-data-table-select").exists()).toBe(true);
    });

    it("does not render select-all checkbox without bulkActions", () => {
      const wrapper = mountHead();
      expect(wrapper.find(".f-data-table-select").exists()).toBe(false);
    });

    it("renders trailing actions Th when actions present", () => {
      const table = mockTable({ actions: fakeActions });
      const wrapper = mountHead({ table });
      expect(wrapper.find(".f-data-table-actions").exists()).toBe(true);
    });

    it("does not render actions Th without actions", () => {
      const wrapper = mountHead();
      expect(wrapper.find(".f-data-table-actions").exists()).toBe(false);
    });

    it("renders sort button for sortable columns", () => {
      const wrapper = mountHead();
      const sortButtons = wrapper.findAll(".f-data-table-header-btn");
      expect(sortButtons).toHaveLength(2);
    });

    it("renders plain label for non-sortable columns", () => {
      const wrapper = mountHead();
      const labels = wrapper.findAll(".f-data-table-header");
      expect(labels).toHaveLength(3);
    });
  });

  describe("interaction — sorting", () => {
    it("clicking sort button calls table.sortBy", async () => {
      const table = mockTable();
      const wrapper = mountHead({ table });
      await wrapper.findAll(".f-data-table-header-btn")[0].trigger("click");
      expect(table.sortBy).toHaveBeenCalledWith("name");
    });

    it("shows sort icon when column is sorted", () => {
      const table = mockTable();
      table.sortField.value = "name";
      // Override isSorted to return true for name
      table.isSorted = (col: DataTableColumn<FakeRow>) => String(col.key) === "name" || (col.sortKey === "name");
      const wrapper = mountHead({ table });
      expect(wrapper.find(".f-data-table-sort-icon").exists()).toBe(true);
    });
  });

  describe("interaction — drag reorder", () => {
    it("mouseenter on drag handle makes column draggable", async () => {
      const wrapper = mountHead();
      const handles = wrapper.findAll(".f-data-table-drag-handle");
      await handles[0].trigger("mouseenter");
      await nextTick();
      // First column th should now be draggable
      const ths = wrapper.findAll("th");
      expect(ths[0].attributes("draggable")).toBe("true");
    });

    it("mouseleave on drag handle removes draggable when not dragging", async () => {
      const wrapper = mountHead();
      const handles = wrapper.findAll(".f-data-table-drag-handle");
      await handles[0].trigger("mouseenter");
      await nextTick();
      await handles[0].trigger("mouseleave");
      await nextTick();
      const ths = wrapper.findAll("th");
      expect(ths[0].attributes("draggable")).toBe("false");
    });

    it("dragstart sets dragging class", async () => {
      const wrapper = mountHead();
      const handles = wrapper.findAll(".f-data-table-drag-handle");
      await handles[0].trigger("mouseenter");
      await nextTick();

      const ths = wrapper.findAll("th");
      await ths[0].trigger("dragstart", { dataTransfer: { effectAllowed: "" } });
      await nextTick();

      expect(ths[0].classes()).toContain("f-data-table-dragging");
    });

    it("dragover on another column sets drop indicator", async () => {
      const wrapper = mountHead();
      const handles = wrapper.findAll(".f-data-table-drag-handle");
      const ths = wrapper.findAll("th");

      // Start dragging column 0
      await handles[0].trigger("mouseenter");
      await nextTick();
      await ths[0].trigger("dragstart", { dataTransfer: { effectAllowed: "" } });
      await nextTick();

      // Drag over column 1
      await ths[1].trigger("dragover");
      await nextTick();

      expect(ths[1].classes()).toContain("f-data-table-drop-right");
    });

    it("dragleave clears drop indicator", async () => {
      const wrapper = mountHead();
      const handles = wrapper.findAll(".f-data-table-drag-handle");
      const ths = wrapper.findAll("th");

      await handles[0].trigger("mouseenter");
      await nextTick();
      await ths[0].trigger("dragstart", { dataTransfer: { effectAllowed: "" } });
      await nextTick();
      await ths[1].trigger("dragover");
      await nextTick();
      await ths[1].trigger("dragleave");
      await nextTick();

      expect(ths[1].classes()).not.toContain("f-data-table-drop-right");
      expect(ths[1].classes()).not.toContain("f-data-table-drop-left");
    });

    it("drop calls reorderColumns", async () => {
      const table = mockTable();
      const wrapper = mountHead({ table });
      const handles = wrapper.findAll(".f-data-table-drag-handle");
      const ths = wrapper.findAll("th");

      await handles[0].trigger("mouseenter");
      await nextTick();
      await ths[0].trigger("dragstart", { dataTransfer: { effectAllowed: "" } });
      await nextTick();
      await ths[1].trigger("drop");
      await nextTick();

      expect(table.reorderColumns).toHaveBeenCalled();
    });

    it("dragend clears all drag state", async () => {
      const wrapper = mountHead();
      const handles = wrapper.findAll(".f-data-table-drag-handle");
      const ths = wrapper.findAll("th");

      await handles[0].trigger("mouseenter");
      await nextTick();
      await ths[0].trigger("dragstart", { dataTransfer: { effectAllowed: "" } });
      await nextTick();
      await ths[0].trigger("dragend");
      await nextTick();

      expect(ths[0].classes()).not.toContain("f-data-table-dragging");
      expect(ths[0].attributes("draggable")).toBe("false");
    });
  });

  describe("passthrough", () => {
    it("pt.thead merges onto thead", () => {
      const wrapper = mountHead({ pt: { thead: { props: { class: "custom" } } } });
      expect(wrapper.find("thead").classes()).toContain("custom");
    });
  });
});
