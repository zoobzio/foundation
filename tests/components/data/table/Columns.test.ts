import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountColumns, mockTable } from "#test/support/fixtures/data";

describe("DataTableColumns", () => {
  describe("static", () => {
    const wrapper = mountColumns();

    it("renders a Popover", () => {
      expect(wrapper.findComponent({ name: "Popover" }).exists()).toBe(true);
    });

    it("renders a Fab trigger", () => {
      expect(wrapper.findComponent({ name: "Fab" }).exists()).toBe(true);
    });

    it("renders a Command", () => {
      expect(wrapper.findComponent({ name: "Command" }).exists()).toBe(true);
    });

    it("passes column groups to Command", () => {
      const command = wrapper.findComponent({ name: "Command" });
      const groups = command.attributes("groups");
      // Should be serialized as attribute since it's a stub
      expect(groups).toBeDefined();
    });

    it("passes multiple=true to Command", () => {
      const command = wrapper.findComponent({ name: "Command" });
      expect(command.attributes("multiple")).toBe("true");
    });
  });

  describe("interaction", () => {
    it("removing a column via Command calls reorderColumns without that key", async () => {
      const table = mockTable();
      table.columnOrder.value = ["id", "name", "status", "created", "amount"];
      const wrapper = mountColumns({ table });
      const command = wrapper.findComponent({ name: "Command" });

      // Emit update:selected with "amount" removed
      command.vm.$emit("update:selected", new Set(["id", "name", "status", "created"]));
      await nextTick();

      expect(table.reorderColumns).toHaveBeenCalledWith(["id", "name", "status", "created"]);
    });

    it("adding a column via Command calls reorderColumns with it inserted in definition order", async () => {
      const table = mockTable();
      table.columnOrder.value = ["id", "name", "created"];
      const wrapper = mountColumns({ table });
      const command = wrapper.findComponent({ name: "Command" });

      // Add "status" back — should insert between name and created (definition order)
      command.vm.$emit("update:selected", new Set(["id", "name", "status", "created"]));
      await nextTick();

      expect(table.reorderColumns).toHaveBeenCalledWith(["id", "name", "status", "created"]);
    });
  });

  describe("passthrough", () => {
    it("pt.popover merges onto Popover", () => {
      const wrapper = mountColumns({ pt: { popover: { props: { class: "custom" } } } });
      expect(wrapper.findComponent({ name: "Popover" }).attributes("class")).toContain("custom");
    });
  });
});
