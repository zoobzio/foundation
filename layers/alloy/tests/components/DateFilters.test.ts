import { describe, it, expect, vi } from "vitest";
import { nextTick } from "vue";
import { mountDateFilters } from "../fixtures";

describe("DateFilters", () => {
  describe("static", () => {
    const wrapper = mountDateFilters();

    it("renders Popover as root", () => {
      expect(wrapper.findComponent({ name: "Popover" }).exists()).toBe(true);
    });

    it("starts at step 1 showing field Command", () => {
      expect(wrapper.findAllComponents({ name: "Command" }).length).toBeGreaterThanOrEqual(1);
    });

    it("renders stepper with Field/Operator/Value labels", () => {
      const steps = wrapper.findAll(".f-date-filters-step");
      expect(steps[0].text()).toBe("Field");
      expect(steps[1].text()).toBe("Operator");
      expect(steps[2].text()).toBe("Value");
    });
  });

  describe("interaction", () => {
    it("advances to step 2 on field select", async () => {
      const wrapper = mountDateFilters();
      const command = wrapper.findAllComponents({ name: "Command" })[0];
      command.vm.$emit("select", "created");
      await nextTick();

      const steps = wrapper.findAll(".f-date-filters-step");
      expect(steps[0].text()).toBe("Created");
    });

    it("advances to step 3 on operator select", async () => {
      const wrapper = mountDateFilters();
      // Step 1 → 2
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "created");
      await nextTick();
      // Step 2 → 3
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "after");
      await nextTick();

      const steps = wrapper.findAll(".f-date-filters-step");
      expect(steps[1].text()).toBe("After");
      // Step 3 should show Calendar (not RangeCalendar since operator is "after")
      expect(wrapper.findComponent({ name: "Calendar" }).exists()).toBe(true);
    });

    it("shows RangeCalendar when operator is between", async () => {
      const wrapper = mountDateFilters();
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "created");
      await nextTick();
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "between");
      await nextTick();

      expect(wrapper.findComponent({ name: "RangeCalendar" }).exists()).toBe(true);
    });

    it("navigates back to step 1 via stepper button click", async () => {
      const wrapper = mountDateFilters();
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "created");
      await nextTick();
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "after");
      await nextTick();

      // Click the field step button to go back to step 1
      const steps = wrapper.findAll(".f-date-filters-step");
      await steps[0].trigger("click");
      await nextTick();

      expect(wrapper.findAll(".f-date-filters-step")[0].text()).toBe("Field");
    });

    it("navigates back to step 2 via stepper button click", async () => {
      const wrapper = mountDateFilters();
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "created");
      await nextTick();
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "after");
      await nextTick();

      const steps = wrapper.findAll(".f-date-filters-step");
      await steps[1].trigger("click");
      await nextTick();

      expect(wrapper.findAll(".f-date-filters-step")[1].text()).toBe("Operator");
    });

    it("calls addFilter on apply button click with single date", async () => {
      const addFilter = vi.fn();
      const wrapper = mountDateFilters({ addFilter });
      // Navigate to step 3
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "created");
      await nextTick();
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "after");
      await nextTick();

      // Set a date via Calendar emit
      const { CalendarDate } = await import("@internationalized/date");
      wrapper.findComponent({ name: "Calendar" }).vm.$emit("update:modelValue", new CalendarDate(2026, 4, 25));
      await nextTick();

      // The apply button's click handler is in the passthrough — trigger it via the Button stub
      const buttons = wrapper.findAllComponents({ name: "Button" });
      const applyBtn = buttons.find((b) => b.text().includes("Apply"));
      applyBtn!.vm.$emit("click");
      await nextTick();

      expect(addFilter).toHaveBeenCalledOnce();
      const arg = addFilter.mock.calls[0][0];
      expect(arg.field).toBe("created");
      expect(arg.operator).toBe("after");
      expect(arg.value).toBeInstanceOf(Date);
    });

    it("updates open via Popover emit", async () => {
      const wrapper = mountDateFilters();
      wrapper.findComponent({ name: "Popover" }).vm.$emit("update:open", true);
      await nextTick();
    });

    it("resets stepper on close", async () => {
      const wrapper = mountDateFilters();
      // Navigate to step 2
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "created");
      await nextTick();
      // Open then close
      wrapper.findComponent({ name: "Popover" }).vm.$emit("update:open", true);
      await nextTick();
      wrapper.findComponent({ name: "Popover" }).vm.$emit("update:open", false);
      await nextTick();

      expect(wrapper.findAll(".f-date-filters-step")[0].text()).toBe("Field");
    });

    it("restores last single-date filter on open", async () => {
      const wrapper = mountDateFilters({
        modelValue: [{ field: "created", operator: "after", value: new Date(Date.UTC(2026, 3, 25)) }],
      });
      wrapper.findComponent({ name: "Popover" }).vm.$emit("update:open", true);
      await nextTick();
      await nextTick(); // watcher + nextTick inside

      const steps = wrapper.findAll(".f-date-filters-step");
      expect(steps[0].text()).toBe("Created");
      expect(steps[1].text()).toBe("After");
    });

    it("restores last between filter on open", async () => {
      const wrapper = mountDateFilters({
        modelValue: [{
          field: "created",
          operator: "between",
          value: new Date(Date.UTC(2026, 0, 1)),
          endValue: new Date(Date.UTC(2026, 11, 31)),
        }],
      });
      wrapper.findComponent({ name: "Popover" }).vm.$emit("update:open", true);
      await nextTick();
      await nextTick();

      expect(wrapper.findComponent({ name: "RangeCalendar" }).exists()).toBe(true);
    });

    it("applies between filter with range", async () => {
      const addFilter = vi.fn();
      const wrapper = mountDateFilters({ addFilter });
      // Navigate to step 3 with "between"
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "created");
      await nextTick();
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "between");
      await nextTick();

      // Set range via RangeCalendar emit
      const { CalendarDate } = await import("@internationalized/date");
      wrapper.findComponent({ name: "RangeCalendar" }).vm.$emit("update:modelValue", {
        start: new CalendarDate(2026, 1, 1),
        end: new CalendarDate(2026, 12, 31),
      });
      await nextTick();

      // Click apply
      const buttons = wrapper.findAllComponents({ name: "Button" });
      const applyBtn = buttons.find((b) => b.text().includes("Apply"));
      applyBtn!.vm.$emit("click");
      await nextTick();

      expect(addFilter).toHaveBeenCalledOnce();
      const arg = addFilter.mock.calls[0][0];
      expect(arg.operator).toBe("between");
      expect(arg.endValue).toBeInstanceOf(Date);
    });

    it("updates fieldSelected via Command emit", async () => {
      const wrapper = mountDateFilters();
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("update:selected", new Set(["created"]));
      await nextTick();
    });

    it("updates operatorSelected via Command emit at step 2", async () => {
      const wrapper = mountDateFilters();
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "created");
      await nextTick();
      // Now at step 2, emit update:selected on the operator Command
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("update:selected", new Set(["after"]));
      await nextTick();
    });

    it("updates calendar date via Calendar emit", async () => {
      const wrapper = mountDateFilters();
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "created");
      await nextTick();
      wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("select", "after");
      await nextTick();

      const { CalendarDate } = await import("@internationalized/date");
      wrapper.findComponent({ name: "Calendar" }).vm.$emit("update:modelValue", new CalendarDate(2026, 6, 15));
      await nextTick();

      const steps = wrapper.findAll(".f-date-filters-step");
      expect(steps[2].text()).toBe("2026-06-15");
    });
  });

  describe("passthrough", () => {
    it("pt.popover merges onto Popover", () => {
      const wrapper = mountDateFilters({ pt: { popover: { props: { class: "custom" } } } });
      expect(wrapper.findComponent({ name: "Popover" }).classes()).toContain("custom");
    });
  });
});
