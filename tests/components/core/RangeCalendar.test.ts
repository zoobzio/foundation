import { describe, it, expect } from "vitest";
import { mountRangeCalendar } from "#test/support/fixtures/components";

describe("RangeCalendar", () => {
  describe("static", () => {
    const wrapper = mountRangeCalendar();

    it("renders root with f-calendar and f-calendar--range classes", () => {
      const root = wrapper.find(".f-calendar");
      expect(root.exists()).toBe(true);
      expect(root.classes()).toContain("f-calendar--range");
    });

    it("defaults numberOfMonths to 1", () => {
      expect(wrapper.find(".f-calendar").attributes("numberofmonths")).toBe("1");
    });

    it("renders navigation buttons", () => {
      expect(wrapper.find(".f-calendar-nav").exists()).toBe(true);
    });

    it("renders grid", () => {
      expect(wrapper.find(".f-calendar-grid").exists()).toBe(true);
    });

    it("renders head cells for weekDays", () => {
      const headCells = wrapper.findAll(".f-calendar-head-cell");
      expect(headCells).toHaveLength(7);
    });

    it("renders grid rows", () => {
      const rows = wrapper.findAll(".f-calendar-row");
      expect(rows.length).toBeGreaterThanOrEqual(2);
    });

    it("renders cell triggers", () => {
      const cells = wrapper.findAll(".f-calendar-cell");
      expect(cells).toHaveLength(7);
    });

    it("renders cell trigger elements", () => {
      const triggers = wrapper.findAll(".f-calendar-cell-trigger");
      expect(triggers).toHaveLength(7);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountRangeCalendar({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-calendar").classes()).toContain("custom");
    });
  });
});
