import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountDateRangePicker } from "#test/support/fixtures/components";

describe("DateRangePicker", () => {
  describe("static", () => {
    const wrapper = mountDateRangePicker();

    it("renders root with f-date-range-picker class", () => {
      expect(wrapper.find(".f-date-range-picker").exists()).toBe(true);
    });

    it("defaults numberOfMonths to 2", () => {
      expect(wrapper.find(".f-date-range-picker").attributes("numberofmonths")).toBe("2");
    });

    it("renders start and end segments", () => {
      expect(wrapper.findAll(".f-date-picker-segment").length).toBeGreaterThan(0);
    });

    it("renders separator", () => {
      expect(wrapper.find(".f-date-picker-separator").exists()).toBe(true);
    });

    it("renders calendar grid cells", () => {
      expect(wrapper.findAll(".f-calendar-cell").length).toBeGreaterThan(0);
    });
  });

  describe("interaction", () => {
    it("updates model via DateRangePickerRoot emit", async () => {
      const wrapper = mountDateRangePicker();
      const { CalendarDate } = await import("@internationalized/date");
      wrapper.findComponent({ name: "DateRangePickerRoot" }).vm.$emit("update:modelValue", {
        start: new CalendarDate(2026, 1, 1),
        end: new CalendarDate(2026, 12, 31),
      });
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountDateRangePicker({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-date-range-picker").classes()).toContain("custom");
    });
  });
});
