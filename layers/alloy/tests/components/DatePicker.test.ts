import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountDatePicker } from "../fixtures";

describe("DatePicker", () => {
  describe("static", () => {
    const wrapper = mountDatePicker();

    it("renders root with f-date-picker class", () => {
      expect(wrapper.find(".f-date-picker").exists()).toBe(true);
    });

    it("defaults granularity to day", () => {
      expect(wrapper.find(".f-date-picker").attributes("granularity")).toBe("day");
    });

    it("renders date segments", () => {
      // Mock segments include a literal "/" and a day "25"
      expect(wrapper.findAll(".f-date-picker-segment").length).toBeGreaterThan(0);
    });

    it("renders literal segments", () => {
      expect(wrapper.findAll(".f-date-picker-literal").length).toBeGreaterThan(0);
    });

    it("renders trigger with calendar icon", () => {
      expect(wrapper.find(".f-date-picker-trigger").exists()).toBe(true);
    });

    it("renders calendar grid cells", () => {
      expect(wrapper.findAll(".f-calendar-cell").length).toBeGreaterThan(0);
    });
  });

  describe("interaction", () => {
    it("updates model via DatePickerRoot emit", async () => {
      const wrapper = mountDatePicker();
      const { CalendarDate } = await import("@internationalized/date");
      wrapper.findComponent({ name: "DatePickerRoot" }).vm.$emit("update:modelValue", new CalendarDate(2026, 4, 25));
      await nextTick();
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountDatePicker({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-date-picker").classes()).toContain("custom");
    });
  });
});
