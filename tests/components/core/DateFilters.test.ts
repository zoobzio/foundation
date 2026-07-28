import { describe, it, expect, vi } from "vitest";
import { nextTick } from "vue";
import { mountDateFilters } from "#test/support/fixtures/components";

// Core tests stub the tier below: the composed core components are replaced by
// name, so assertions target the stubs' emitted contracts, not their internals.
// The field/operator pickers are single-select Commands: a choice arrives as
// `update:modelValue` carrying the selected option array (the current Command
// contract — the pre-migration `select`/`update:selected` events are gone).
const selectField = (wrapper: ReturnType<typeof mountDateFilters>, value: string, label: string) =>
  wrapper.findAllComponents({ name: "Command" })[0].vm.$emit("update:modelValue", [{ value, label }]);

describe("DateFilters", () => {
  describe("static", () => {
    const wrapper = mountDateFilters();

    it("renders Popover as root", () => {
      expect(wrapper.findComponent({ name: "Popover" }).exists()).toBe(true);
    });

    it("starts at step 1 showing the field Command", () => {
      expect(wrapper.findAllComponents({ name: "Command" }).length).toBeGreaterThanOrEqual(1);
    });

    it("renders the stepper with Field/Operator/Value labels", () => {
      const steps = wrapper.findAll(".f-date-filters-step");
      expect(steps[0].text()).toBe("Field");
      expect(steps[1].text()).toBe("Operator");
      expect(steps[2].text()).toBe("Value");
    });
  });

  describe("interaction", () => {
    it("advances to step 2 on field select", async () => {
      const wrapper = mountDateFilters();
      selectField(wrapper, "created", "Created");
      await nextTick();

      const steps = wrapper.findAll(".f-date-filters-step");
      expect(steps[0].text()).toBe("Created");
    });

    it("advances to step 3 on operator select and shows Calendar", async () => {
      const wrapper = mountDateFilters();
      selectField(wrapper, "created", "Created");
      await nextTick();
      selectField(wrapper, "after", "After");
      await nextTick();

      const steps = wrapper.findAll(".f-date-filters-step");
      expect(steps[1].text()).toBe("After");
      expect(wrapper.findComponent({ name: "Calendar" }).exists()).toBe(true);
    });

    it("shows RangeCalendar when the operator is between", async () => {
      const wrapper = mountDateFilters();
      selectField(wrapper, "created", "Created");
      await nextTick();
      selectField(wrapper, "between", "Between");
      await nextTick();

      expect(wrapper.findComponent({ name: "RangeCalendar" }).exists()).toBe(true);
    });

    it("navigates back to step 1 via the stepper button", async () => {
      const wrapper = mountDateFilters();
      selectField(wrapper, "created", "Created");
      await nextTick();
      selectField(wrapper, "after", "After");
      await nextTick();

      await wrapper.findAll(".f-date-filters-step")[0].trigger("click");
      await nextTick();

      expect(wrapper.findAll(".f-date-filters-step")[0].text()).toBe("Field");
    });

    it("navigates back to step 2 via the stepper button", async () => {
      const wrapper = mountDateFilters();
      selectField(wrapper, "created", "Created");
      await nextTick();
      selectField(wrapper, "after", "After");
      await nextTick();

      await wrapper.findAll(".f-date-filters-step")[1].trigger("click");
      await nextTick();

      expect(wrapper.findAll(".f-date-filters-step")[1].text()).toBe("Operator");
    });

    it("calls addFilter on apply with a single date", async () => {
      const addFilter = vi.fn();
      const wrapper = mountDateFilters({ addFilter });
      selectField(wrapper, "created", "Created");
      await nextTick();
      selectField(wrapper, "after", "After");
      await nextTick();

      const { CalendarDate } = await import("@internationalized/date");
      wrapper.findComponent({ name: "Calendar" }).vm.$emit("update:modelValue", new CalendarDate(2026, 4, 25));
      await nextTick();

      const applyBtn = wrapper
        .findAllComponents({ name: "Button" })
        .find((b) => b.text().includes("Apply"));
      applyBtn?.vm.$emit("click");
      await nextTick();

      expect(addFilter).toHaveBeenCalledOnce();
      const arg = addFilter.mock.calls[0][0];
      expect(arg.field).toBe("created");
      expect(arg.operator).toBe("after");
      expect(arg.value).toBeInstanceOf(Date);
    });

    it("applies a between filter with a range", async () => {
      const addFilter = vi.fn();
      const wrapper = mountDateFilters({ addFilter });
      selectField(wrapper, "created", "Created");
      await nextTick();
      selectField(wrapper, "between", "Between");
      await nextTick();

      const { CalendarDate } = await import("@internationalized/date");
      wrapper.findComponent({ name: "RangeCalendar" }).vm.$emit("update:modelValue", {
        start: new CalendarDate(2026, 1, 1),
        end: new CalendarDate(2026, 12, 31),
      });
      await nextTick();

      const applyBtn = wrapper
        .findAllComponents({ name: "Button" })
        .find((b) => b.text().includes("Apply"));
      applyBtn?.vm.$emit("click");
      await nextTick();

      expect(addFilter).toHaveBeenCalledOnce();
      const arg = addFilter.mock.calls[0][0];
      expect(arg.operator).toBe("between");
      expect(arg.endValue).toBeInstanceOf(Date);
    });

    it("resets the stepper on close", async () => {
      const wrapper = mountDateFilters();
      selectField(wrapper, "created", "Created");
      await nextTick();
      wrapper.findComponent({ name: "Popover" }).vm.$emit("update:open", true);
      await nextTick();
      wrapper.findComponent({ name: "Popover" }).vm.$emit("update:open", false);
      await nextTick();

      expect(wrapper.findAll(".f-date-filters-step")[0].text()).toBe("Field");
    });

    it("restores the last single-date filter on open", async () => {
      const wrapper = mountDateFilters({
        modelValue: [{ field: "created", operator: "after", value: new Date(Date.UTC(2026, 3, 25)) }],
      });
      wrapper.findComponent({ name: "Popover" }).vm.$emit("update:open", true);
      await nextTick();
      await nextTick();

      const steps = wrapper.findAll(".f-date-filters-step");
      expect(steps[0].text()).toBe("Created");
      expect(steps[1].text()).toBe("After");
    });

    it("restores the last between filter on open", async () => {
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

    it("reflects the calendar date in the value step label", async () => {
      const wrapper = mountDateFilters();
      selectField(wrapper, "created", "Created");
      await nextTick();
      selectField(wrapper, "after", "After");
      await nextTick();

      const { CalendarDate } = await import("@internationalized/date");
      wrapper.findComponent({ name: "Calendar" }).vm.$emit("update:modelValue", new CalendarDate(2026, 6, 15));
      await nextTick();

      const steps = wrapper.findAll(".f-date-filters-step");
      expect(steps[2].text()).toBe("2026-06-15");
    });
  });

  describe("passthrough", () => {
    it("pt.popover merges onto the Popover part", () => {
      const wrapper = mountDateFilters({ pt: { popover: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "Popover" }).classes()).toContain("custom");
    });
  });
});
