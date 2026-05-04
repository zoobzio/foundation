import { describe, it, expect, vi } from "vitest";
import { mountBody, mockTable } from "../fixtures";
import { fakeActions, fakeBulkActions } from "../data/table";
import type { FakeRow } from "../data/table";

describe("DataTableBody", () => {
  describe("static", () => {
    const wrapper = mountBody();

    it("renders tbody element", () => {
      expect(wrapper.find("tbody").exists()).toBe(true);
    });

    it("renders a row per data item", () => {
      const rows = wrapper.findAll("tr");
      expect(rows).toHaveLength(3);
    });

    it("renders cells for each visible column per row", () => {
      // 3 rows × 5 columns = 15 td elements
      const cells = wrapper.findAll("td");
      expect(cells).toHaveLength(15);
    });

    it("renders cell text content", () => {
      expect(wrapper.text()).toContain("Alice");
      expect(wrapper.text()).toContain("Bob");
      expect(wrapper.text()).toContain("Charlie");
    });
  });

  describe("conditional", () => {
    it("shows empty message when data is empty", () => {
      const table = mockTable();
      table.data.value = [];
      const wrapper = mountBody({ table });
      expect(wrapper.text()).toContain("No data");
    });

    it("renders row checkboxes when bulkActions present", () => {
      const table = mockTable({ bulkActions: fakeBulkActions });
      const wrapper = mountBody({ table });
      const selectCells = wrapper.findAll(".f-data-table-select");
      expect(selectCells).toHaveLength(3);
    });

    it("does not render row checkboxes without bulkActions", () => {
      const wrapper = mountBody();
      expect(wrapper.find(".f-data-table-select").exists()).toBe(false);
    });

    it("renders action menu per row when actions present", () => {
      const table = mockTable({ actions: fakeActions });
      const wrapper = mountBody({ table });
      const actionCells = wrapper.findAll(".f-data-table-actions");
      expect(actionCells).toHaveLength(3);
    });

    it("does not render action cells without actions", () => {
      const wrapper = mountBody();
      expect(wrapper.find(".f-data-table-actions").exists()).toBe(false);
    });
  });

  describe("formatCell rendering", () => {
    it("formats date columns", () => {
      const table = mockTable();
      // Use a date that won't shift across midnight in any timezone
      table.data.value = [{ id: 1, name: "A", status: "Active", created: "2025-03-15T12:00:00", amount: 0 }];
      table.visibleColumns.value = [{ key: "created", label: "Created", type: "date" }];
      const wrapper = mountBody({ table });
      expect(wrapper.text()).toContain("Mar 15, 2025");
    });

    it("formats datetime columns", () => {
      const table = mockTable();
      table.data.value = [{ id: 1, name: "A", status: "Active", created: "2025-03-15T12:00:00", amount: 0 }];
      table.visibleColumns.value = [{ key: "created", label: "Created", type: "datetime" }];
      const wrapper = mountBody({ table });
      expect(wrapper.text()).toMatch(/Mar 15, 2025/);
    });

    it("formats currency columns", () => {
      const table = mockTable();
      table.data.value = [{ id: 1, name: "A", status: "Active", created: "", amount: 1234.5 }];
      table.visibleColumns.value = [{ key: "amount", label: "Amount", type: "currency" }];
      const wrapper = mountBody({ table });
      expect(wrapper.text()).toContain("$1,234.50");
    });

    it("formats number columns", () => {
      const table = mockTable();
      table.data.value = [{ id: 1, name: "A", status: "Active", created: "", amount: 9999 }];
      table.visibleColumns.value = [{ key: "amount", label: "Amount", type: "number" }];
      const wrapper = mountBody({ table });
      expect(wrapper.text()).toContain("9,999");
    });

    it("formats boolean columns", () => {
      const table = mockTable();
      table.data.value = [{ id: 1, name: "A", status: "Active", created: "", amount: 1 }];
      table.visibleColumns.value = [{ key: "amount", label: "Flag", type: "boolean" }];
      const wrapper = mountBody({ table });
      expect(wrapper.text()).toContain("Yes");
    });

    it("formats boolean false as No", () => {
      const table = mockTable();
      table.data.value = [{ id: 1, name: "A", status: "Active", created: "", amount: 0 }];
      table.visibleColumns.value = [{ key: "amount", label: "Flag", type: "boolean" }];
      const wrapper = mountBody({ table });
      expect(wrapper.text()).toContain("No");
    });

    it("renders null values as empty string", () => {
      const table = mockTable();
      table.data.value = [{ id: 1, name: null, status: "Active", created: "", amount: 0 }] as unknown as FakeRow[];
      table.visibleColumns.value = [{ key: "name", label: "Name", type: "text" }];
      const wrapper = mountBody({ table });
      // The span should exist but be empty
      const spans = wrapper.findAll("span");
      const nameSpan = spans.find((s) => s.text() === "");
      expect(nameSpan).toBeDefined();
    });
  });

  describe("image column", () => {
    it("renders Img for image-type columns", () => {
      const table = mockTable();
      table.data.value = [{ id: 1, name: "https://example.com/img.png", status: "Active", created: "", amount: 0 }];
      table.visibleColumns.value = [{ key: "name", label: "Avatar", type: "image" }];
      const wrapper = mountBody({ table });
      expect(wrapper.findComponent({ name: "Img" }).exists()).toBe(true);
    });
  });

  describe("checkbox interaction", () => {
    it("calls toggleRow when checkbox emits update:model-value", async () => {
      const table = mockTable({ bulkActions: fakeBulkActions });
      const wrapper = mountBody({ table });
      const checkbox = wrapper.findComponent({ name: "Checkbox" });
      checkbox.vm.$emit("update:model-value", true);
      expect(table.toggleRow).toHaveBeenCalled();
    });
  });

  describe("action menu", () => {
    it("calls action when Menu emits select with known label", async () => {
      const actionSpy = vi.fn();
      const table = mockTable({ actions: [{ icon: "edit", label: "Edit", action: actionSpy }] });
      const wrapper = mountBody({ table });
      const menu = wrapper.findComponent({ name: "Menu" });
      menu.vm.$emit("select", { label: "Edit" });
      expect(actionSpy).toHaveBeenCalled();
    });

    it("does not throw when Menu emits select with unknown label", () => {
      const table = mockTable({ actions: fakeActions });
      const wrapper = mountBody({ table });
      const menu = wrapper.findComponent({ name: "Menu" });
      // Should not throw
      menu.vm.$emit("select", { label: "nonexistent" });
    });
  });

  describe("passthrough", () => {
    it("pt.tbody merges onto tbody", () => {
      const wrapper = mountBody({ pt: { tbody: { props: { class: "custom" } } } });
      expect(wrapper.find("tbody").classes()).toContain("custom");
    });
  });
});
